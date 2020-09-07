import tweepy
import pytz
import os

utc = pytz.timezone('UTC')


class TwitterAPI:
    def __init__(self, user_account_id, end_date):
        consumer_key = os.environ.get("TWITTER_CONSUMER_KEY")
        consumer_secret = os.environ.get("TWITTER_CONSUMER_SECRET")
        access_token = os.environ.get("TWITTER_ACCESS_TOKEN")
        access_token_secret = os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        self.auth_api = tweepy.API(
            auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True
        )
        self.target = user_account_id

        self.end_date = end_date

    def get_fetch_tweet_limit(self):
        # Output format {'limit': 900, 'remaining': 900, 'reset': 1586700000}
        response = self.auth_api.rate_limit_status()
        return response['resources']['statuses']['/statuses/user_timeline']

    def fetch_tweets(self):
        print("Current Rate: {} (starting)".format(self.get_fetch_tweet_limit()))
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
                print(
                    "Imported {} tweets for account {}".format(tweet_count, self.target)
                )
            else:
                break
        print("Current Rate: {} (ending)".format(self.get_fetch_tweet_limit()))
        return tweets
