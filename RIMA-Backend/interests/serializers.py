import json
from .models import (
    Paper,
    Keyword,
    BlacklistedKeyword,
    ShortTermInterest,
    LongTermInterest,
    Category,
    Tweet,
)
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", )


class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = "__all__"


class KeywordSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)

    class Meta:
        model = Keyword
        fields = "__all__"


class BlacklistedKeywordSerializer(serializers.ModelSerializer):
    keyword = serializers.SerializerMethodField()

    def get_keyword(self, instance):
        return instance.keyword.name

    class Meta:
        model = BlacklistedKeyword
        fields = "__all__"


class ShortTermInterestSerializer(serializers.ModelSerializer):
    keyword = serializers.SerializerMethodField()
    original_keyword = serializers.SerializerMethodField()
    original_keywords = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    paper_db_ids = serializers.SerializerMethodField()
    tweet_ids = serializers.SerializerMethodField()

    def get_tweet_ids(self, instance):
        if instance.tweets.count():
            return [tweet.id_str for tweet in instance.tweets.all()]
        return []

    def get_paper_db_ids(self, instance):
        return list(instance.papers.values_list("id", flat=True))

    def get_categories(self, instance):
        return CategorySerializer(instance.keyword.categories.all(),
                                  many=True).data

    def get_keyword(self, instance):
        return instance.keyword.name

    def get_original_keyword(self, instance):
        return instance.keyword.original_keyword_name

    def get_original_keywords(self, instance):
        try:
            original_keywords = json.loads(instance.keyword.original_keywords)
        except:
            original_keywords = []
        return original_keywords

    class Meta:
        model = ShortTermInterest
        fields = "__all__"


class LongTermInterestSerializer(serializers.ModelSerializer):
    keyword = serializers.SerializerMethodField()
    original_keyword = serializers.SerializerMethodField()
    original_keywords = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    tweet_ids = serializers.SerializerMethodField()
    papers = PaperSerializer(many=True)

    def get_tweet_ids(self, instance):
        if instance.tweets.count():
            return [tweet.id_str for tweet in instance.tweets.all()]
        return []

    def get_categories(self, instance):
        return CategorySerializer(instance.keyword.categories.all(),
                                  many=True).data

    def get_keyword(self, instance):
        return instance.keyword.name

    def get_original_keyword(self, instance):
        return instance.keyword.original_keyword_name

    def get_original_keywords(self, instance):
        try:
            original_keywords = json.loads(instance.keyword.original_keywords)
        except:
            original_keywords = []
        return original_keywords

    class Meta:
        model = LongTermInterest
        fields = "__all__"


class KeywordCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=1000)
    weight = serializers.FloatField(max_value=5, min_value=1)


#class TopicSerializer(serializers.Serializer):
 #   key = serializers.ListField()
    #value=serializers.CharField(max_length=1000)


class ListDataSerializer(serializers.Serializer):
    keywords = KeywordCreateSerializer(many=True)


class InterestExtractionSerializer(serializers.Serializer):
    text = serializers.CharField()
    algorithm = serializers.ChoiceField(choices=[
        ("Yake", "Yake"),
        ("SingleRank", "SingleRank"),
        ("TopicRank", "TopicRank"),
        ("TextRank", "TextRank"),
        ("PositionRank", "PositionRank"),
        ("Rake", "Rake"),
        ("MultipartiteRank", "MultipartiteRank"),
        ("TopicalPageRank", "TopicalPageRank"),
    ])
    wiki_filter = serializers.BooleanField(default=True)
    num_of_keywords = serializers.IntegerField(default=20)


class KeywordSimilariySerializer(serializers.Serializer):
    keywords_1 = serializers.ListField()
    keywords_2 = serializers.ListField()
    algorithm = serializers.ChoiceField(choices=[
        ("WordEmbedding", "WordEmbedding"),
        ("WikiLinkMeasure", "WikiLinkMeasure"),
    ])


class WikiCategoriesSerializer(serializers.Serializer):
    interests = serializers.ListField()


class TweetSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault(), )

    class Meta:
        model = Tweet
        fields = ('id_str', 'full_text', 'entities', 'user', "screen_name")

"""
BAB 
class JSONSerialize(serializers.Serializer):
    intetest = serializers.CharField()


class DictSerializer(serializers.Serializer):
    keywords = serializers.ListField()
    weights = serializers.ListField()
"""
