import tweepy
import pytz
import os
import random
from tweepy.parsers import JSONParser
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikifilter
from .utils import get_interest_similarity_score

utc = pytz.timezone('UTC')

# TODO: needs to be removed after discussion with Ralf
# TWITTER_API_KEY = "VHR72dG8nWMZBHYFeyDOlYvV5"
# TWITTER_API_SECRET = "SFyixwvoEVUIcDUO45qhdpI5JEtOOlE2oSQOLNw1v8bsZ5Nh6X"
# TWITTER_ACCESS = "864566506558033922-4SLdxLmvX1hOmM3KM5MeGpY6WuTXMjG"
# TWITTER_ACCESS_SECRET = "MzlrG0f1bMJ2VR1JLeoZgXaVeGp1cgtAON7o1d6ZdFhXf"

# AUTH = tweepy.OAuthHandler(TWITTER_API_KEY, TWITTER_API_SECRET)
# AUTH.set_access_token(TWITTER_ACCESS, TWITTER_ACCESS_SECRET)

AUTH = tweepy.OAuthHandler(os.environ.get("TWITTER_API_KEY"), os.environ.get("TWITTER_API_SECRET"))
AUTH.set_access_token(os.environ.get("TWITTER_ACCESS"), os.environ.get("TWITTER_ACCESS_SECRET"))

API = tweepy.API(AUTH, parser=JSONParser())


class TwitterAPI:
    def __init__(self, user_account_id, end_date):
        consumer_key = os.environ.get("TWITTER_CONSUMER_KEY")
        consumer_secret = os.environ.get("TWITTER_CONSUMER_SECRET")
        access_token = os.environ.get("TWITTER_ACCESS_TOKEN")
        access_token_secret = os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        self.auth_api = tweepy.API(auth,
                                   wait_on_rate_limit=True,
                                   wait_on_rate_limit_notify=True)
        self.target = user_account_id

        self.end_date = end_date

    def get_fetch_tweet_limit(self):
        # Output format {'limit': 900, 'remaining': 900, 'reset': 1586700000}
        response = self.auth_api.rate_limit_status()
        return response['resources']['statuses']['/statuses/user_timeline']

    def fetch_tweets(self):
        print("Current Rate: {} (starting)".format(
            self.get_fetch_tweet_limit()))
        tweets = []
        tweet_count = 0
        for tweet in tweepy.Cursor(
                self.auth_api.user_timeline,
                id=self.target,
                tweet_mode="extended",
                wait_on_rate_limit=True,
                wait_on_rate_limit_notify=True,
        ).items():
            tweet_count += 1
            tweet_ct = utc.localize(tweet.created_at)
            if tweet_ct > self.end_date:
                tweets.append(tweet._json)
                print("Imported {} tweets for account {}".format(
                    tweet_count, self.target))
            else:
                break
        print("Current Rate: {} (ending)".format(self.get_fetch_tweet_limit()))
        return tweets


def extract_tweet_from_response(tweet, tag):
    # with open("jsonlog.json", "a+") as f:
    #     f.write(json.dumps(tweet)+",")

    tweet_fields = [
        "id_str",
        "created_at",
        # "text",
        "full_text",
        "retweet_count",
        "favorite_count",
    ]
    user_fields = [
        "id_str",
        "name",
        "screen_name",
        "description",
        "url",
        "followers_count",
        "friends_count",
        "statuses_count",
        "profile_image_url_https",
        "profile_background_color",
    ]
    if "retweeted_status" in tweet.keys():
        tweet = tweet["retweeted_status"]
    try:
        media = tweet["extended_entities"]["media"]
    except KeyError:
        try:
            media = tweet["entities"]["media"]
        except KeyError:
            media = None
    # with open("media.json", "a+") as f:
    #     f.write(json.dumps(media))

    result = {x: tweet[x] for x in tweet_fields}
    if media:
        result["media"] = media
    result["user"] = {x: tweet["user"][x] for x in user_fields}
    result["color"] = tag["color"]
    result["tagId"] = tag["id"]
    print(result)
    return result


def generate_geo_code(tag):
    """returns the geo code for twitter api using lat, lang and km provided by the front-end"""
    lat = tag.get("lat", None)
    lang = tag.get("lang", None)
    km = tag.get("km", None)
    if (lat is not None) and (lang is not None) and (km is not None):
        return f"{lat}, {lang}, {km}km"
    else:
        return None


def get_recommended_tweets(tags):
    user_interest_model_list = []  # creates a list of user interest model
    full_result = []
    for tag in tags:
        extra_kwargs = {}
        geo_code = generate_geo_code(tag)
        if geo_code is not None:
            extra_kwargs['geocode'] = geo_code
        language = tag.get("lang", None)
        if language is not None:
            extra_kwargs['lang'] = language
        user_interest_model_list.append(tag["text"])
        response = API.search(
            q=tag["text"],
            tweet_mode="extended",
            count=tag["n_tweets"],
            # count=25,
            **extra_kwargs)

        results = [
            extract_tweet_from_response(x, tag) for x in response["statuses"]
        ]
        full_result.extend(results)

    # TODO:
    #   1. Get five tweets for each user interest model and put it in an array
    #   2. Take the full_text of each tweet and perform the keywords extraction function
    #       2.1 use full_result[0].get("full_text") to get the text of the tweet
    #       2.2 extracted_keywords = getKeyword("tweet full_text", "TopicRank")
    #       -> returns an object { "Timesheet": "5" } -> need to use the key
    #   3. Take the extracted_keywords and tags and calculate similarity
    #   4. Sort the list according to score

    # Extract unique tweets according to their IDs
    unique_tweets = {each['id_str']: each for each in full_result}.values()

    print(len(full_result))
    print(len(unique_tweets))

    tweets_with_scores = []
    for result in unique_tweets:
        text = result.get("full_text")
        algorithm = "Yake"
        extract_keywords_from_tweet = getKeyword(text, algorithm)
        # wiki_keyword_redirect_mapping, keywords_extracted = wikifilter(extract_keywords_from_tweet)
        # keywords_list = list(keywords_extracted.keys())
        keywords_list = list(extract_keywords_from_tweet.keys())
        # # uncomment "score" before DOCKER deployment
        score = round((get_interest_similarity_score(
            user_interest_model_list, keywords_list) or 0) * 100, 2)

        # # comment "score" before DOCKER deployment
        # score = round((random.random() or 0) * 100, 2)
        if score > 40:
            result["score"] = score
            tweets_with_scores.append(result)

    sorted_list = sorted(tweets_with_scores,
                         key=lambda k: k['score'],
                         reverse=True)
    return sorted_list
