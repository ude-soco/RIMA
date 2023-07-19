import datetime
import tweepy
import json
import pytz
from dateutil import parser
from django.conf import settings
from accounts.models import User
from interests.models import Tweet, Paper, ShortTermInterest, Author, Citation, user_blacklisted_paper
from .utils import (
    generate_long_term_model,
    generate_short_term_model,
    generate_short_term_model_dbpedia,
    generate_user_short_term_interests,
    fetch_papers_keywords,
    generate_authors_interests,
    regenerate_long_term_model,
)

from celery import task
from common.config import BaseCeleryTask

from .twitter_utils import TwitterAPI
from .tweet_preprocessing import TwitterPreprocessor
from .semantic_scholar import SemanticScholarAPI
from collections import Counter

utc = pytz.timezone("UTC")


@task(
    name="import_tweets",
    base=BaseCeleryTask,
    # autoretry_for=(tweepy.errors.TooManyRequests, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
) # type: ignore
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
    # autoretry_for=(tweepy.errors.TooManyRequests, ),
    retry_kwargs={
        'max_retries': 5,
        'countdown': 30 * 60
    },
) # type: ignore
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
) # type: ignore
def import_papers_for_user(user_id):
    __import_publications_for_user(user_id)


@task(
    name="update_short_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def update_short_term_interest_model():
    for user in User.objects.all():
        if user.twitter_account_id:
            # generate_short_term_model(user.id, ShortTermInterest.TWITTER)
            generate_short_term_model_dbpedia(user.id, ShortTermInterest.TWITTER)
        if user.author_id:
            # generate_short_term_model(user.id, ShortTermInterest.SCHOLAR)
            generate_short_term_model_dbpedia(user.id, ShortTermInterest.SCHOLAR)


@task(
    name="update_long_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
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
    name="import_user_citation_data",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def import_user_citation_data(user_id):
            store_connections_to_authors(user_id) #done    
            import_authors_papers(user_id) #done
            fetch_authors_papers_keywords(user_id)
            generate_user_authors_interests(user_id)

@task(
    name="update_short_term_interest_model_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def update_short_term_interest_model_for_user(user_id):
    __update_short_term_interest_model_for_user(user_id)


@task(
    name="update_long_term_interest_model_for_user",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def update_long_term_interest_model_for_user(user_id):
    generate_long_term_model(user_id)

def remove_papers_for_user(user_id, papers):
    user = User.objects.get(id=user_id)
    for paper in papers:
        paper.user.remove(user)
        paper.save()
        user_blacklisted_paper.objects.get_or_create(user=user, paper_id=paper.paper_id)
        # if the paper is not linked to any user, delete from the database
        if not paper.user.all():
             paper.delete()
    return

@task(
    name="import_user_data",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def import_user_data(user_id):  # it is executed in the sign-up
    print("importing tweets")
    __import_tweets_for_user(user_id)

    print("importing papers")
    __import_publications_for_user(user_id)

    print("compute papers' keywords")
    __fetch_user_papers_keywords(user_id)

    print("compute short term model")
    __update_short_term_interest_model_for_user(user_id)

    print("compute long term model")
    generate_long_term_model(user_id)
    # uncomment the following line to include importing the citations in the user registration process
    # print("compute citations")
    # import_user_citation_data(user_id)
    return

@task(
    name="regenerate_interest_profile",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def regenerate_interest_profile(user_id):
    __fetch_user_papers_keywords(user_id)
    regenerate_short_term_interest_model(user_id)
    manual_regenerate_long_term_model(user_id)
    return

@task(
    name="regenerate_short_term_interest_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def regenerate_short_term_interest_model(user_id):
    user = User.objects.get(id=user_id)
    ShortTermInterest.objects.filter(user_id=user_id).exclude(papers__in=user.papers.all()).delete()
    __update_short_term_interest_model_for_user(user_id)
    return

@task(
    name="manual_regenerate_long_term_model",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def manual_regenerate_long_term_model (user_id):
    regenerate_long_term_model(user_id)
    return


@task(
    name="import_user_papers",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def import_user_papers(user_id):
    __import_publications_for_user(user_id)
    return

@task(
    name="getRefCitAuthorsPapers",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def getRefCitAuthorsPapers(authorId, method):
    results={"listAllAuthors":[]}
    dictAuthorsNames={}

    api=SemanticScholarAPI()
    if method in ["citations", "references"]:
        data=api.citations_references(id=authorId, method=method)
    else:
        print("expected method to be either citations or references")


    for paper in data:
        for m in paper[method]:
            if len(m["authors"]) != 0:
                if authorId not in m["authors"]:
                    for author in m["authors"]:
                        if author["authorId"]!=None:
                            if author["authorId"]!=authorId:
                                listAuthors=results["listAllAuthors"]
                                listAuthors.append(author["authorId"])
                                results["listAllAuthors"]=listAuthors
                                if author["authorId"] in results:
                                    papers=[]
                                    papers=results[author["authorId"]]
                                    papers.append(m["paperId"])

                                    results[author["authorId"]]=papers
                                else:
                                    results[author["authorId"]]=[m["paperId"]]
                                    dictAuthorsNames[author["authorId"]]=[author["name"]]

    results["authorsNames"]=dictAuthorsNames
    return results

@task(
    name="getConnectedAuthorsData",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def getConnectedAuthorsData(user_author_id, number_of_top_connected_authors):
    #This function gets the ids of the top authors connected to a user
    # The number of returned authors is specified by the argument number_of_top_connected_authors
    # The function returns a dictionary that has "cited_by" and "referenced"  keys
    # each of "cited_by" and "referenced" is linked to a list of tupels 
    # each tuple represnte the name of the author, his/ her id and the number of times he cited / was referenced by the user

    # citations
    print("get most authors who cited me the most")
    allCitsRefs=getRefCitAuthorsPapers(authorId=user_author_id, method="citations")
    listAuthors = allCitsRefs["listAllAuthors"]
    dictAuthorsName = allCitsRefs["authorsNames"]
    top_cited_by_authors = list(Counter(listAuthors).most_common(number_of_top_connected_authors))

    top_cited_by_with_names = []
    for author_id, count in top_cited_by_authors:
        author_name_list = dictAuthorsName.get(author_id, [])
        if len(author_name_list) > 0:
            author_name = author_name_list[0]
            top_cited_by_with_names.append((author_id, author_name, count))


    #references
    print("get authors Who I cited the most")
    allCitsRefs=getRefCitAuthorsPapers(authorId=user_author_id, method="references")
    listAuthors = allCitsRefs["listAllAuthors"]
    dictAuthorsName = allCitsRefs["authorsNames"]
    top_referenced_authors = list(Counter(listAuthors).most_common(number_of_top_connected_authors))

    top_referenced_with_names = []
    for author_id, count in top_referenced_authors:
        author_name_list = dictAuthorsName.get(author_id, [])
        if len(author_name_list) > 0:
            author_name = author_name_list[0]
            top_referenced_with_names.append((author_id, author_name, count))
    
    data={"cited_by":top_cited_by_with_names, "references":top_referenced_with_names}
    return data


def  store_connections_to_authors(user_id):
    user= User.objects.get(id= user_id)
    # This function stores the connection of the connected authors to a particulare user in the database
    connected_authors = getConnectedAuthorsData(user.author_id, 3)
    cited_by_authors= connected_authors["cited_by"]
    referenced_authors = connected_authors["references"]
    # save them as Authors in the database and connect them in the citations table to the user
    for author_data in cited_by_authors:
        author_id = author_data[0]
        author_name = author_data[1]
        value = author_data[2]
        # add author to Authors table if not exist
        author, created = Author.objects.get_or_create(author_id=author_id, defaults={"name": author_name, "papers_fetched": False})
        # link author to user in Citations table
        citation, created = Citation.objects.get_or_create(user=user, author=author, relation=Citation.CITED_BY, defaults={"value": value})
        if not created:
            citation.weight = value
            citation.save()
        
    for author_data in referenced_authors:
        author_id = author_data[0]
        author_name = author_data[1]
        value = author_data[2]
        # add author to Authors table if not exist
        author, created = Author.objects.get_or_create(author_id=author_id, defaults={"name": author_name, "papers_fetched": False})
        # link author to user in Citations table
        citation, created = Citation.objects.get_or_create(user=user, author=author, relation=Citation.REFERENCES, defaults={"value": value})
        if not created:
            citation.value = value
            citation.save()
    return

def import_authors_papers(user_id):
    # This functions gets the papers for all the authors that are connected to the user in the attributes
    user = User.objects.get(id=user_id)
    authors = Author.objects.filter(author_citations__user=user)
    current_year = datetime.datetime.now().year
    start_year = current_year - 4  # Collecting papers from the past 5 years, including the current year
    api = SemanticScholarAPI()
    for author in authors:
        publications = api.get_user_publications(User(author_id= author.author_id), start_year, current_year)
        for paper in publications:
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
                })
            if created:
                # if a new paper was found for that author, it means that his/her interests needs to be recalculated
                author.interests_generated = False
            paper_object.author.add(author)
        author.papers_fetched = True
        author.save()
    return


def fetch_authors_papers_keywords(user_id):
    user = User.objects.get(id= user_id)
    authors = Author.objects.filter(author_citations__user=user)
    if authors:
        paper_candidates = Paper.objects.filter(author__in=authors, used_in_calc=False)
        fetch_papers_keywords(paper_candidates)
    return

def __fetch_user_papers_keywords(user_id):
    user = User.objects.get(id= user_id)
    paper_candidates = user.papers.filter(used_in_calc= False)
    fetch_papers_keywords(paper_candidates)
    return

def generate_user_authors_interests(user_id):
    generate_authors_interests(user_id)
    return

@task(
    name="import_user_paperdata",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
) # type: ignore
def import_user_paperdata(user_id):

    print("compute short term model")
    __update_short_term_interest_model_for_user(user_id)

    print("compute long term model")
    generate_long_term_model(user_id)
