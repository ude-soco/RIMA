import datetime
import tweepy
import json
import pytz
from dateutil import parser
from django.conf import settings
from accounts.models import User
from interests.models import Tweet, Paper, ShortTermInterest
from .utils import generate_long_term_model, generate_short_term_model

from celery.decorators import task
from common.config import BaseCeleryTask

from .twitter_utils import TwitterAPI
from .tweet_preprocessing import TwitterPreprocessor
from .semantic_scholar import SemanticScholarAPI

utc = pytz.timezone('UTC')


@task(
    name="import_tweets",
    base=BaseCeleryTask,
    autoretry_for=(tweepy.RateLimitError, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def import_tweets():
    for user in User.objects.exclude(twitter_account_id=None):
        end_date = utc.localize(datetime.datetime.today() - datetime.timedelta(
            days=settings.TWITTER_FETCH_DAYS))
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
                ))
        Tweet.objects.bulk_create(tweet_objects)
        print("Tweets import completed for {}".format(user.username))


@task(
    name="import_papers",
    base=BaseCeleryTask,
    autoretry_for=(ConnectionRefusedError, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 20 * 60
    },
)
def import_papers():
    for user in User.objects.exclude(author_id=None):
        __import_papers_for_user(user.id)


def __import_tweets_for_user(user_id):
    user = User.objects.get(id=user_id)
    if not user.twitter_account_id:
        return
    end_date = utc.localize(datetime.datetime.today() - datetime.timedelta(
        days=settings.TWITTER_FETCH_DAYS))
    if user.tweets.exists():
        end_date = user.tweets.order_by("-created_on").first().created_on

    api = TwitterAPI(user.twitter_account_id, end_date)
    tweets = api.fetch_tweets()

    tweet_objects = []
    for item in tweets:
        full_text = TwitterPreprocessor(item.get("full_text",
                                                 "")).fully_preprocess().text
        tweet_objects.append(
            Tweet(
                id_str=item.get("id_str", ""),
                full_text=full_text,
                entities=json.dumps(item.get("entities", {})),
                created_at=parser.parse(item["created_at"]),
                user=user,
            ))
    Tweet.objects.bulk_create(tweet_objects)
    print("Tweets import completed for {}".format(user.username))


@task(
    name="import_tweets_for_user",
    base=BaseCeleryTask,
    autoretry_for=(tweepy.RateLimitError, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def import_tweets_for_user(user_id):
    __import_tweets_for_user(user_id)


def __import_papers_for_user(user_id):
    user = User.objects.get(id=user_id)
    if not user.author_id:
        return
    current_year = datetime.datetime.now().year
    api = SemanticScholarAPI()

    papers = api.get_user_papers(user, current_year - 5, current_year)

    for item in papers:
        Paper.objects.update_or_create(
            user=user,
            paper_id=item.get("paperId", ""),
            defaults={
                "title":
                item.get("title", ""),
                "url":
                item.get("url", ""),
                "year":
                item.get("year"),
                "abstract":
                item.get("abstract"),
                "authors":
                ','.join(
                    list(map(lambda p: p['name'], item.get("authors", []))))
            },
        )
    print("Papers import completed for {}".format(user.username))


@task(
    name="import_papers_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def import_papers_for_user(user_id):
    __import_papers_for_user(user_id)


@task(
    name="update_short_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def update_short_term_interest_model():
    for user in User.objects.all():
        if user.twitter_account_id:
            generate_short_term_model(user.id, ShortTermInterest.TWITTER)
        if user.author_id:
            generate_short_term_model(user.id, ShortTermInterest.SCHOLAR)


@task(
    name="update_long_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def update_long_term_interest_model():
    for user in User.objects.all():
        generate_long_term_model(user.id)


def __update_short_term_interest_model_for_user(user_id):
    user = User.objects.get(id=user_id)
    if user.twitter_account_id:
        generate_short_term_model(user.id, ShortTermInterest.TWITTER)
    if user.author_id:
        generate_short_term_model(user.id, ShortTermInterest.SCHOLAR)


@task(
    name="update_short_term_interest_model_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def update_short_term_interest_model_for_user(user_id):
    __update_short_term_interest_model_for_user(user_id)


@task(
    name="update_long_term_interest_model_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def update_long_term_interest_model_for_user(user_id):
    generate_long_term_model(user_id)


@task(
    name="import_user_data",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def import_user_data(user_id):
    print("importing tweets")
    __import_tweets_for_user(user_id)

    print("importing papers")
    __import_papers_for_user(user_id)

    print("compute short term model")
    __update_short_term_interest_model_for_user(user_id)

    print("compute long term model")
    generate_long_term_model(user_id)


@task(
    name="import_user_paperdata",
    base=BaseCeleryTask,
    autoretry_for=(Exception, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
)
def import_user_paperdata(user_id):

    print("compute short term model")
    __update_short_term_interest_model_for_user(user_id)

    print("compute long term model")
    generate_long_term_model(user_id)
