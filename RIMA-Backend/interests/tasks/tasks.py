import datetime
import tweepy
import json
import pytz
from dateutil import parser
from django.conf import settings
from accounts.models import User
from .author_tasks import import_user_citation_data
# from .interest_tasks import fetch_user_papers_keywords
from interests.models import Tweet, Paper, ShortTermInterest
from interests.utils import (
    generate_long_term_model,
    generate_short_term_model,
    generate_short_term_model_dbpedia,
    fetch_papers_keywords,
)
from interests.utils.interest_utils import generate_user_short_term_interests



from celery.decorators import task
from common.config import BaseCeleryTask

from ..twitter_utils import TwitterAPI
from ..tweet_preprocessing import TwitterPreprocessor
from ..semantic_scholar import SemanticScholarAPI
from collections import Counter

utc = pytz.timezone("UTC")

def fetch_user_papers_keywords(user_id):
    user = User.objects.get(id= user_id)
    paper_candidates = user.papers.filter(used_in_calc= False)
    fetch_papers_keywords(paper_candidates)
    return

@task(
    name="import_tweets",
    base=BaseCeleryTask,
    # autoretry_for=(tweepy.RateLimitError, ),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_tweets():
    for user in User.objects.exclude(twitter_account_id=None):
        end_date = utc.localize(
            datetime.datetime.today()
            - datetime.timedelta(days=settings.TWITTER_FETCH_DAYS)
        )
        if user.tweets.exists():
            end_date = user.tweets.order_by("-created_on").first().created_on

        api = TwitterAPI(user.twitter_account_id, end_date)
        tweets = api.fetch_tweets()

        tweet_objects = []
        for item in tweets:
            tweet_objects.append(
                Tweet(
                    id_str=item.get("id_str", ""),
                    full_text=item.get("full_text", ""),
                    entities=json.dumps(item.get("entities", {})),
                    created_at=parser.parse(item["created_at"]),
                    user=user,
                )
            )
        Tweet.objects.bulk_create(tweet_objects)
        print("Tweets import completed for {}".format(user.username))


@task(
    name="import_papers",
    base=BaseCeleryTask,
    autoretry_for=(ConnectionRefusedError,),
    retry_kwargs={"max_retries": 5, "countdown": 20 * 60},
)
def import_papers():
    for user in User.objects.exclude(author_id=None):
        __import_publications_for_user(user.id)


def __import_tweets_for_user(user_id):
    user = User.objects.get(id=user_id)
    if not user.twitter_account_id:
        return
    end_date = utc.localize(
        datetime.datetime.today() - datetime.timedelta(days=settings.TWITTER_FETCH_DAYS)
    )
    if user.tweets.exists():
        end_date = user.tweets.order_by("-created_on").first().created_on

    api = TwitterAPI(user.twitter_account_id, end_date)
    tweets = api.fetch_tweets()

    tweet_objects = []
    for item in tweets:
        full_text = (
            TwitterPreprocessor(item.get("full_text", "")).fully_preprocess().text
        )
        tweet_objects.append(
            Tweet(
                id_str=item.get("id_str", ""),
                full_text=full_text,
                entities=json.dumps(item.get("entities", {})),
                created_at=parser.parse(item["created_at"]),
                user=user,
            )
        )
    Tweet.objects.bulk_create(tweet_objects)
    print("Tweets import completed for {}".format(user.username))

@task(
    name="import_tweets_for_user",
    base=BaseCeleryTask,
    # autoretry_for=(tweepy.RateLimitError, ),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_tweets_for_user(user_id):
    __import_tweets_for_user(user_id)

def __import_publications_for_user(user_id):
    user = User.objects.get(id=user_id)

    if not user.author_id:
        return

    current_year = datetime.datetime.now().year
    start_year = current_year - 4  # Collecting papers from the past 5 years, including the current year

    api = SemanticScholarAPI()
    publications = api.get_user_publications(user, start_year, current_year)
    blacklisted_papers_ids = user.blacklisted_papers.values_list('paper_id', flat=True)
    for paper in publications:
        if paper.get("paperId", "") in blacklisted_papers_ids:
            continue
        paper_object, created= Paper.objects.get_or_create(
            paper_id=paper.get("paperId", ""),
            defaults={
                "title": paper.get("title", ""),
                "url": paper.get("url", ""),
                "year": paper.get("year"),
                "abstract": paper.get("abstract"),
                "authors": ",".join(
                    list(map(lambda p: p["name"], paper.get("authors", [])))
                ),
            },
        )
        paper_object.user.add(user)
    print("Publications import completed for {}".format(user.username))
    return


@task(
    name="import_papers_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_papers_for_user(user_id):
    __import_publications_for_user(user_id)


#Todo: Check its usage. It might be unneccessary to keep it
@task(
    name="update_short_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def update_short_term_interest_model():
    for user in User.objects.all():
        if user.twitter_account_id:
            # generate_short_term_model(user.id, ShortTermInterest.TWITTER)
            generate_short_term_model_dbpedia(user.id, ShortTermInterest.TWITTER)
        if user.author_id:
            # generate_short_term_model(user.id, ShortTermInterest.SCHOLAR)
            generate_short_term_model_dbpedia(user.id, ShortTermInterest.SCHOLAR)

#TODO: Check the celery task. Add a scheduler to update the long-term intersts
# Forgetting function
@task(
    name="update_long_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def update_long_term_interest_model():
    for user in User.objects.all():
        generate_long_term_model(user.id)


def __update_short_term_interest_model_for_user(user_id):
    user = User.objects.get(id=user_id)
    if user.twitter_account_id:
        # generate_short_term_model(user.id, ShortTermInterest.TWITTER)
        generate_short_term_model_dbpedia(user.id, ShortTermInterest.TWITTER)
    if user.author_id:
        # generate_short_term_model(user.id, ShortTermInterest.SCHOLAR)
        generate_user_short_term_interests(user.id)

@task(
    name="update_short_term_interest_model_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def update_short_term_interest_model_for_user(user_id):
    __update_short_term_interest_model_for_user(user_id)


@task(
    name="update_long_term_interest_model_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def update_long_term_interest_model_for_user(user_id):
    generate_long_term_model(user_id)

@task(
    name="import_user_data",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_user_data(user_id):  # it is executed in the sign-up
    print("importing tweets")
    __import_tweets_for_user(user_id)

    print("importing papers")
    __import_publications_for_user(user_id)

    print("compute papers' keywords")
    # fetch_user_papers_keywords(user_id)

    print("compute short term model")
    __update_short_term_interest_model_for_user(user_id)

    print("compute long term model")
    generate_long_term_model(user_id)
    # uncomment the following lines to include importing the citations in the user registration process
    # print("compute citations")
    # import_user_citation_data(user_id)
    return

@task(
    name="import_user_papers",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_user_papers(user_id):
    __import_publications_for_user(user_id)
    return

@task(
    name="import_user_paperdata",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_user_paperdata(user_id):

    print("compute short term model")
    __update_short_term_interest_model_for_user(user_id)

    print("compute long term model")
    generate_long_term_model(user_id)
