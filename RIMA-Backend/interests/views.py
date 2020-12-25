import datetime
import monthdelta
import json
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication,SessionAuthentication,BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from collections import OrderedDict
from django.urls import reverse
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    DestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView
)
from urllib.parse import unquote
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikifilter,wikicategory
from interests.update_interests import normalize
from .topicutils import (applyTopicMiningTopic,applyTopicMiningKeyword,getTopKeywords,getPaperswithTopics,getTopicDetails,
compareTopics,getAllTopics,getTopicWeightsAllYears,getDataForPieTopics,getDataForPieKeys,
getMultipleYearTopicJourney,getPaperIDFromPaperTitle,getMultipleYearKeyJourney,
getTopicEvoultion,generateVennData,generateVennDataKeys,getAllAuthorsDict,
getAllAuthors,getAllKeywords,getAllTopicsAllYears
,getTopKeysForAllYear,getAllKeywordsAllYears,
searchForKeyword,searchForTopics,getTopTopicsForAllYears,
getAuthorFromAuthorName,getFlowChartDataTopics,
getFlowChartDataKeywords,getAbstractbasedonKeyword,
getDataAuthorComparisonTopics,getAuthorsForYear,authorConfTopicComparison,
getDataAuthorComparisonKeywords,fetchTopicsuserID,getTopTopics,compareAuthors,
getKeyDetails,getPaperswithKeys,compareLAKwithAuthortopics,getAuthorComparisionData,getAuthorsDict)#printText
from .TopicExtractor import fetchAllTopics,fetchAbstracts_author,updateAllTopics
from .serializers import (
    PaperSerializer,
    ListDataSerializer,
    BlacklistedKeywordSerializer,
    ShortTermInterestSerializer,
    LongTermInterestSerializer,
    InterestExtractionSerializer,
    KeywordSimilariySerializer,
    WikiCategoriesSerializer, TweetSerializer,
    TopicSerializer,JSONSerialize,DictSerializer
)
from .models import (
    Keyword,
    BlacklistedKeyword,
    ShortTermInterest,
    Paper,
    Tweet,
    LongTermInterest,
)
from accounts.models import User
from .twitter_utils import get_recommended_tweets
from .utils import get_interest_similarity_score, get_top_long_term_interest_by_weight, get_top_short_term_interest_by_weight, get_radar_similarity_data, get_heat_map_data, get_venn_chart_data
from interests.tasks import import_user_data, import_user_paperdata


class TriggerPaperUpdate(APIView):
    def post(self, request, *args, **kwargs):
        import_user_paperdata.delay(request.user.id)
        return Response({})

class TriggerDataUpdate(APIView):
    def post(self, request, *args, **kwargs):
        import_user_data.delay(request.user.id)
        return Response({})

class LongTermInterestView(ListCreateAPIView):
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        order_key = (
            "created_on" if self.request.GET.get("order") == "date" else "-weight"
        )
        return self.request.user.long_term_interests.all().order_by(order_key)

    def post(self, request, *args, **kwargs):
        serializer = ListDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for keyword in serializer.validated_data["keywords"]:
            name, weight = keyword["name"], keyword["weight"]
            keyword_obj, created = Keyword.objects.get_or_create(name=name.lower())
            LongTermInterest.objects.update_or_create(
                user=request.user, keyword=keyword_obj, defaults={"weight": weight}
            )
            # Clear this keyword from blacklist
            BlacklistedKeyword.objects.filter(user=request.user, keyword=keyword_obj).delete()
        return Response({})


class LongTermInterestItemView(RetrieveUpdateDestroyAPIView):
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        return self.request.user.long_term_interests.all()

    def perform_destroy(self, instance):
        BlacklistedKeyword.objects.update_or_create(
            user=self.request.user, keyword=instance.keyword
        )
        ShortTermInterest.objects.filter(
            keyword=instance.keyword, user=self.request.user
        ).delete()
        return super().perform_destroy(instance)



class PaperView(ListCreateAPIView):
    serializer_class = PaperSerializer

    def get_queryset(self):
        # return self.request.user.papers.filter(paper_id="manual")
        return self.request.user.papers.all().order_by("-year")

    def post(self, request, *args, **kwargs):
        request_data = self.request.data
        request_data["user"] = request.user.id
        serializer = self.serializer_class(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PaperItemView(RetrieveUpdateDestroyAPIView):
    serializer_class = PaperSerializer

    def get_queryset(self):
        return self.request.user.papers.all()


class UserBlacklistedKeywordItemView(DestroyAPIView):
    serializer_class = BlacklistedKeywordSerializer

    def get_queryset(self):
        return self.request.user.blacklisted_keywords.all().order_by("name")



class SimilarityView(RetrieveAPIView):
    def get_queryset(self):
        return User.objects.all()

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        keywords_1 = list(
            user.long_term_interests.values_list("keyword__name", flat=True)
        )
        keywords_2 = list(
            request.user.long_term_interests.values_list("keyword__name", flat=True)
        )
        score = 'N/A'
        if len(keywords_1) and len(keywords_2):
            score = get_interest_similarity_score(keywords_1, keywords_2)
            if score is None:
                score = 'N/A'
            else:
                score = round(float(score) * 100, 2)

        # compute data for radar chart
        user_1_interests = {item.keyword.name: item.weight for item in LongTermInterest.objects.filter(user=request.user).order_by("-weight")[:5]}
        user_2_interests = {item.keyword.name: item.weight for item in LongTermInterest.objects.filter(user=user).order_by("-weight")[:5]}

        radar_chart_data = get_radar_similarity_data(user_1_interests, user_2_interests)

        return Response({
            "score": score,
            "bar_chart_data": {"user_1_data": radar_chart_data["user_1_data"], "user_2_data": radar_chart_data["user_2_data"]},
            "heat_map_data": get_heat_map_data(user_1_interests.keys(), user_2_interests.keys()),
            "venn_chart_data": get_venn_chart_data(user_1_interests.keys(), user_2_interests.keys())
       })


class PublicInterestExtractionView(GenericAPIView):
    """
    Extracts keywords from the specified text based on the selected algorithm
    """

    authentication_classes = ()
    permission_classes = ()
    serializer_class = InterestExtractionSerializer

    def post(self, request, *args, **kwargs):
        inputs = self.serializer_class(data=request.data)
        inputs.is_valid(raise_exception=True)
        payload = inputs.validated_data
        keyword_weight_mapping = getKeyword(
            payload["text"], model=payload["algorithm"], num=payload["num_of_keywords"]
        )
        if payload["wiki_filter"]:
            wiki_keyword_redirect_mapping, keyword_weight_mapping = wikifilter(
                keyword_weight_mapping
            )
        keywords = normalize(keyword_weight_mapping)
        return Response(keyword_weight_mapping)


class PublicKeywordSimilarityView(GenericAPIView):
    """
    Returns the similarity score for 2 sets of keywords based on the selected Algorithm
    """

    authentication_classes = ()
    permission_classes = ()
    serializer_class = KeywordSimilariySerializer

    def post(self, request, *args, **kwargs):
        inputs = self.serializer_class(data=request.data)
        inputs.is_valid(raise_exception=True)
        payload = inputs.validated_data
        score = get_interest_similarity_score(
            payload["keywords_1"], payload["keywords_2"], payload["algorithm"]
        )
        return Response({"score": round((score or 0) * 100, 2)})


class PublicKeywordCategoriesView(GenericAPIView):
    """
    Returns the Wikipedia categories of interest terms
    """

    authentication_classes = ()
    permission_classes = ()
    serializer_class = WikiCategoriesSerializer

    def post(self, request, *args, **kwargs):
        inputs = self.serializer_class(data=request.data)
        inputs.is_valid(raise_exception=True)
        payload = inputs.validated_data
        categories = {}
        for interest in payload["interests"]:
            category = wikicategory(interest)
            categories[interest] = category
        return Response(categories)


class UserStreamGraphView(APIView):
    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs["pk"])
        twitter_data = OrderedDict()
        scholar_data = OrderedDict()
        today = datetime.date.today()

        top_twitter_keywords = list(
            ShortTermInterest.objects.filter(
                user=user, source=ShortTermInterest.TWITTER
            )
            .order_by("-weight")
            .values_list("keyword__name", flat=True)
        )
        top_twitter_keywords = list(set(top_twitter_keywords))[:10]

        top_paper_keywords = list(
            ShortTermInterest.objects.filter(
                user=user, source=ShortTermInterest.SCHOLAR
            )
            .order_by("-weight")
            .values_list("keyword__name", flat=True)
        )
        top_paper_keywords = list(set(top_paper_keywords))[:10]

        for index in range(5, -1, -1):
            # data for last 6 months
            date = today - monthdelta.monthdelta(months=index)
            twitter_data[date.strftime("%B %Y")] = list(
                ShortTermInterest.objects.filter(
                    model_month=date.month,
                    model_year=date.year,
                    user=user,
                    source=ShortTermInterest.TWITTER,
                    keyword__name__in=top_twitter_keywords,
                ).values("keyword__name", "weight")
            )

        for index in range(4, -1, -1):
            # data for last 5 years
            year = today.year - index
            scholar_data[str(year)] = list(
                ShortTermInterest.objects.filter(
                    model_year=year,
                    user=user,
                    source=ShortTermInterest.SCHOLAR,
                    keyword__name__in=top_paper_keywords,
                ).values("keyword__name", "weight")
            )
        response_data = {"twitter_data": twitter_data, "paper_data": scholar_data}
        return Response(response_data)


class UserLongTermInterestView(ListAPIView):
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        user = get_object_or_404(User, pk=self.kwargs["pk"])
        return get_top_long_term_interest_by_weight(user.id, 15)
class UserShortTermInterestViewDummy(ListAPIView):
    serializer_class = ShortTermInterestSerializer

    def get(self,request):
        print(get_top_short_term_interest_by_weight(1,5))
        return Response({"test":get_top_short_term_interest_by_weight(1, 5)})


class UserShortTermInterestView(ListAPIView):
    serializer_class = ShortTermInterestSerializer

    def get_queryset(self):
        user = get_object_or_404(User, pk=self.kwargs["pk"])
        return get_top_short_term_interest_by_weight(user.id, 5)



class UserActivityStatsView(APIView):
    def get(self, request, *args, **kwargs):
        paper_data = OrderedDict()
        tweet_data = OrderedDict()
        user = get_object_or_404(User, pk=kwargs["pk"])

        for paper in Paper.objects.filter(user=user).order_by("year"):
            key_name = paper.year
            paper_data[key_name] = paper_data.get(key_name, 0) + 1

        for tweet in Tweet.objects.filter(user=user).order_by("created_at"):
            key_name = tweet.created_at.strftime("%B %Y")
            tweet_data[key_name] = tweet_data.get(key_name, 0) + 1
        return Response({"papers": paper_data, "tweets": tweet_data})



@api_view(["post"])
def recommended_tweets(request, *args, **kwargs):
    # print(request.data)
    # [{'id': 'Thailand', 'text': 'Thailand'}, {'id': 'India', 'text': 'India'}]
    tweets = get_recommended_tweets(request.data)
    return Response(
        {"message": "Hello, world!",
        "data": tweets
        }
    )


class TweetView(ListCreateAPIView):
    serializer_class = TweetSerializer

    def get_queryset(self):
        return Tweet.objects.filter(user=self.request.user)

    class Meta:
        model = Tweet


class DeleteTweetView(DestroyAPIView):
    serializer_class = TweetSerializer
    lookup_field = 'id_str'

    def get_queryset(self):
        return Tweet.objects.filter(user=self.request.user)

    class Meta:
        model = Tweet
class HelloView(APIView):
    def get(self):
        return Response(data={"message": "hello world "})
'''
View regarding topic wordcloud
'''
class TopicsView(APIView):
    def get(self, request,*args, **kwargs):
        serializer_class = TopicSerializer
        #print("The serializer is:",serializer_class)
        #print(applyTopicMining())
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        #print("The year is:",year)
        return Response({"topics":applyTopicMiningTopic(topics_split[-1],topics_split[-2])})
'''
View regarding keyword topic cloud
'''
class KeywordsView(APIView):
    def get(self, request,*args, **kwargs):
        serializer_class = TopicSerializer
        #print("The serializer is:",serializer_class)
        #print(applyTopicMining())
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        #print("The year is:",year)
        return Response({"keywords":applyTopicMiningKeyword(topics_split[-1],topics_split[-2])})

class AllTopicsViewDB(APIView):
    def get(self,request,*args,**kwargs):
        yearList=[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020]
        algorithm="Yake"
        return Response({"dbupdate":fetchAllTopics(yearList,algorithm)})
'''
View for the bar chart top 10 keywords/top 10 publications
'''
class TopicBarView(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=DictSerializer
        url_path=request.get_full_path()
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"keywords":getTopKeywords(topics_split[-1])})
'''
View for the bar chart top 10 topics/top 10 publications
'''
class TopicBarViewTopics(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=DictSerializer
        url_path=request.get_full_path()
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"keywords":getTopTopics(topics_split[-1])})
class populateTopicView(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=TopicSerializer
        url_path=request.get_full_path()
        year=url_path[-4:]
        return Response({"topicsdict":getPaperswithTopics(year)[1]})
class populateKeyView(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=TopicSerializer
        url_path=request.get_full_path()
        year=url_path[-4:]
        return Response({"topicsdict":getPaperswithKeys(year)[1]})
class getTopicBarValues(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=JSONSerialize
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        topics_split=url_path.split(r"/")
        return Response({"docs":getTopicDetails(topics_split[-2],topics_split[-1])})
class getKeyBarValues(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=JSONSerialize
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        topics_split=url_path.split(r"/")
        return Response({"docs":getKeyDetails(topics_split[-2],topics_split[-1])})
class vennPlotView(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"set":compareTopics("2013","2012")})

class allTopics(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"topics":getAllTopicsAllYears()})
class allKeys(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"topics":getAllKeywordsAllYears()})
class AllTopicDicts(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"weights":getTopicWeightsAllYears(topics_split[-1])[0],
        "years":getTopicWeightsAllYears(topics_split[-1])[1]})
'''
View to get topics for the pie chart
'''
class TopicPieView(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=TopicSerializer
        url_path=request.get_full_path()
        
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        year=topics_split[-1]
        
        num=topics_split[-2]
       
        return Response({"topics":getDataForPieTopics(year,num)[0],"weights":getDataForPieTopics(year,num)[1]})
'''
View to get keyword data for pie chart
'''
class KeyPieView(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=TopicSerializer
        url_path=request.get_full_path()
        url_path=request.get_full_path()
        
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        year=topics_split[-1]
        
        num=topics_split[-2]
        return Response({"keys":getDataForPieKeys(year,num)[0],"weights":getDataForPieKeys(year,num)[1]})
'''
View to get topics for stacked area chart- topic evolution
'''
class MultipleTopicAreaView(APIView):
    def get(self,request,*args,**kwargs):

        url_path=request.get_full_path()
        #print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split("?")
        print(topics_split[1])
        topics_split_params=topics_split[1].split("&")
        print(topics_split_params,"*********************")
        #listoftopics=["Learning","Analytics"]
        #getKeyWeightsAllYears
        return Response({"weights":getMultipleYearTopicJourney(topics_split_params)[0],"years":getMultipleYearTopicJourney(topics_split_params)[1]})
'''
View to get keywords for stacked area chart- topic evolution
'''
class MultipleKeyAreaView(APIView):
    def get(self,request,*args,**kwargs):
        

      
        url_path=request.get_full_path()
        
        url_path=url_path.replace("%20"," ")
        print("the url path is:",url_path)
        topics_split=url_path.split("?")
        print(topics_split[1])
        topics_split_params=topics_split[1].split("&")
        print(topics_split_params,"*********************")
        #listoftopics=["Learning","Analytics"]
        #getKeyWeightsAllYears
        return Response({"weights":getMultipleYearKeyJourney(topics_split_params)[0],"years":getMultipleYearKeyJourney(topics_split_params)[1]})

class FetchPaperView(APIView):
    def get(self,request,*args,**kwargs):
        serializer_class=TopicSerializer
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        
        print(url_path.find(r"/"))
        count_slash=url_path.count(r"/")
        topics_split=url_path.split("!")
        val=""
        if count_slash>4:
            val=topics_split[-2]
        else:
            val=topics_split[-1]
        return Response({'url':getPaperIDFromPaperTitle(topics_split[-1])})
class AuthorsFetchView(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"authors":getAllAuthors()})
class AuthorsDictFetchView(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"authors":getAllAuthorsDict()})
class TopicOverview(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"overview":getTopicEvoultion()})
'''
View to obtain topics for Author Conference Venn Diagram
'''
class AuthorConfComparisionView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=unquote(url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"compare":authorConfTopicComparison(topics_split[-3],topics_split[-2],topics_split[-1])})
'''
View to obtain common topics for the conference venn diagram
'''
class VennOverview(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        #url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"commontopics":generateVennData(topics_split[-2],topics_split[-1])})
'''
View to obtain common keywords for conference venn diagram
'''
class VennOverviewKeys(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        #url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"commontopics":generateVennDataKeys(topics_split[-2],topics_split[-1])}) 
'''
get all keywords for the author network
'''      
class AllKeywordsView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"keywords":getAllKeywords(topics_split[-1])})
'''
get all topics for author network
'''
class AllTopicsView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"keywords":getAllTopics(topics_split[-1])})
'''
View to get keywords for the author network
'''
class SearchKeywordView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"titles":searchForKeyword(topics_split[-1],topics_split[-2])})
'''
View to get topics for the author network
'''
class SearchTopicView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"titles":searchForTopics(topics_split[-1],topics_split[-2])})
'''
View to get topic data for the stacked bar chart across years
'''
class FetchTopicView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        #print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split("?")
        topics_split_params=topics_split[1].split("&")
        print(topics_split_params)
        #getTopKeysForAllYear
        return Response({"Topiclist":getTopTopicsForAllYears(topics_split_params)})
'''
View to get keyword data for the stacked bar chart across years
'''
class FetchKeyView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        #print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split("?")
        topics_split_params=topics_split[1].split("&")
        print(topics_split_params)
        #getTopKeysForAllYear
        return Response({"Topiclist":getTopKeysForAllYear(topics_split_params)})
class UpdateAllTopics(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"alltpcs":updateAllTopics()})

class FetchAuthorView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        url_path = unquote(url_path)
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"authors":getAuthorFromAuthorName(topics_split[-3],topics_split[-2],topics_split[-1])})
class OverviewChartViewTopics(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"topicoverview":getFlowChartDataTopics(topics_split[-1],topics_split[-2])})
class OverviewChartViewKeywords(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"keyoverview":getFlowChartDataKeywords(topics_split[-1],topics_split[-2])})
class FetchAbstractView(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"abstractview":getAbstractbasedonKeyword(topics_split[-1],topics_split[-2])})
'''
View to get topic details of Author
'''
class AuthorFetchYearView(APIView):
      def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"authors":getAuthorsForYear(topics_split[-1])})
'''
View to get topic details
'''
class AuthorTopicComparisonView(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def get(self,request,*args,**kwargs):
        # print(request.user)
        # for user in User.objects.all():
        #     print(user)
        #     token,created=Token.objects.get_or_create(user=user)
        #     print(token.key)
        # print("user:",request.user)
        url_path=request.get_full_path()
        url_path=unquote(url_path)

        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split("?")
        topics_split_params=topics_split[1].split("&")
        print(topics_split_params)
        return Response({"authortopics":compareAuthors(topics_split_params[-4],topics_split_params[-3],
        topics_split_params[-2],topics_split_params[-1])})
        #return Response({"authortopics":getDataAuthorComparisonTopics(topics_split_params[-1],topics_split_params[-3],topics_split_params[-2])})
class AuthorKeywordComparisonView(APIView):
    def get(self,request,*args,**kwargs):
        print(request)
        url_path=request.get_full_path()
        #print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split("?")
        topics_split_params=topics_split[1].split("&")
        print(topics_split_params)
        return Response({"authortopics":getDataAuthorComparisonKeywords(topics_split_params[-1],
        topics_split_params[-3],
        topics_split_params[-2])})
class CompareAuthorConf(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"papers": fetchTopicsuserID(topics_split[-1],topics_split[-2])})
class AuthorDBInsertView(APIView):
    def get(self,request,*args,**kwargs):
        return Response({"dbinsert":fetchAbstracts_author()})
class AuthorComparisonData(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"authortopics":getAuthorComparisionData(topics_split[-2],topics_split[-1])}
        )
class FetchAuthorsDict(APIView):
     def get(self,request,*args,**kwargs):
        return Response({"authors":getAuthorsDict()})
class AuthorConfComparisonData(APIView):
    def get(self,request,*args,**kwargs):
        url_path=request.get_full_path()
        print("the url path is:",url_path)
        url_path=url_path.replace("%20"," ")
        topics_split=url_path.split(r"/")
        print(topics_split)
        return Response({"vals":compareLAKwithAuthortopics(topics_split[-2],topics_split[-1])})
#For demo
# class printHelloBackend(APIView):
#     def get(self,request,*args,**kwargs):
#         return Response({"btext":printText()})