from . import models as account_models
from rest_framework import serializers
from interests.models import ShortTermInterest


class UserSerializer(serializers.ModelSerializer):
    paper_count = serializers.SerializerMethodField()
    tweet_count = serializers.SerializerMethodField()

    def get_tweet_count(self, instance):
        return instance.tweets.count()

    def get_paper_count(self, instance):
        return instance.papers.count()

    class Meta:
        model = account_models.User
        fields = (
            "email",
            "first_name",
            "last_name",
            "id",
            "twitter_account_id",
            "author_id",
            "paper_count",
            "tweet_count",
        )


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = account_models.User
        fields = "__all__"
