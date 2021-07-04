# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 
# test import BEGIN
from .DataExtractor import ConferenceDataCollector  as dataCollector
from . import ConferenceUtils as confutils
import datetime
import json
from collections import OrderedDict
from django.urls import conf, reverse
from django.http.response import HttpResponse
from rest_framework.views import APIView
from urllib.parse import unquote
from rest_framework.response import Response
from .topicutils import (
    #added by mouadh 'getsimilarity'
    getsimilarity,
    applyTopicMiningTopic,
    applyTopicMiningKeyword,
    getTopKeywords,
    getPaperswithTopics,
    getTopicDetails,
    compareTopics,
    getAllTopics,
    getTopicWeightsAllYears,
    getDataForPieTopics,
    getDataForPieKeys,
    getMultipleYearTopicJourney,
    getPaperIDFromPaperTitle,
    getMultipleYearKeyJourney,
    getTopicEvoultion,
    generateVennData,
    generateVennDataKeys,
    getAllAuthorsDict,
    getAllAuthors,
    getAllKeywords,
    getAllTopicsAllYears,
    getTopKeysForAllYear,
    getAllKeywordsAllYears,
    searchForKeyword,
    searchForTopics,
    getTopTopicsForAllYears,
    getAuthorFromAuthorName,
    getFlowChartDataTopics,
    getFlowChartDataKeywords,
    getAbstractbasedonKeyword,
    getDataAuthorComparisonTopics,
    getAuthorsForYear,
    authorConfTopicComparison,
    getDataAuthorComparisonKeywords,
    fetchTopicsuserID,
    getTopTopics,
    compareAuthors,
    getKeyDetails,
    getPaperswithKeys,
    compareLAKwithAuthortopics,
    getAuthorComparisionData,
    getAuthorsDict,   #printText 
    getConfEvents)  #BAB 08.06.2021::Extension for other conferences other than LAK
from .TopicExtractor import (fetchAllTopics, fetchAbstracts_author, updateAllTopics)
from .serializers import PreloadedConferenceListSerializer,ConferenceSerializer, PlatformSerializer,ConferenceEventSerializer
from rest_framework.generics import (ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView,
                                     DestroyAPIView, ListAPIView,
                                     RetrieveAPIView, CreateAPIView)

from .models import Platform, Conference, Conference_Event,PreloadedConferenceList, Conference_Event_Paper 



"""
BAB Conference Events views
"""
class ConferenceEventsView(ListCreateAPIView):
    serializer_class = ConferenceEventSerializer
    
    def get_queryset(self):
        data = []
        url_path = self.request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        conference_events_objs = Conference_Event.objects.filter(conference_name_abbr= topics_split[-1])        
        for conference_event_obj in conference_events_objs:
            conference_event_obj.no_of_stored_papers = conference_event_obj.conference_event_papers.all().count()

        return conference_events_objs


"""
BAB Conference Events views
"""
class CollectEventPapersView(ListCreateAPIView): 
   
    def get(self, request, *args, **kwargs):
        data = [{}]
        url_path = self.request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        confutils.addDataToConfPaperModel(topics_split[-2],topics_split[-1])
        return Response(data)





"""
BAB Conference Events views
"""
class ExtractEventTrendsView(ListCreateAPIView): 
   
    def get(self, request, *args, **kwargs):
        data = [{}]
        url_path = self.request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        confutils.addDatatoKeywordAndTopicModels(topics_split[-1])
        return Response(data)
'''
BAB Add Conference View

'''

class addConferenceView(ListCreateAPIView):
    serializer_class = PlatformSerializer
    conference_serializer_class = ConferenceSerializer
    def get(self, request, *args, **kwargs):
        data = []
        conferences_events_JSON = []
        conferences = Conference.objects.all()
        for conference in conferences:
            conference_events = Conference_Event.objects.filter(
                                conference_name_abbr = conference.conference_name_abbr).values_list(
                                'conference_event_name_abbr',
                                flat=True)
            for event in conference_events:
                conferences_events_JSON.append({
                    'value': event,
                    'label': event,
                })
            data.append({
                'platform_name' : conference.platform_name.platform_name,
                'platform_url' : conference.platform_name.platform_url,
                'conference_name_abbr' : conference.conference_name_abbr,
                'conference_url' : conference.conference_url,
                'conference_events': conferences_events_JSON,
                'no_of_events': conference_events.count(),
            })
            conferences_events_JSON =[]    
        return Response(data)
    
    def post(self, request, *args, **kwargs):
        request_data = self.request.data
        stored_platforms = Platform.objects.filter(platform_name=request_data['platform_name']).count()

        if stored_platforms:
            platform_obj = Platform.objects.get(platform_name=request_data['platform_name'])

            conference = Conference.objects.create(
            conference_name_abbr=request_data['conferences'][0]['conference_name_abbr'],
            conference_url=request_data['conferences'][0]['conference_url'],
            platform_name=platform_obj
            )
            conference.save()
            confutils.addDataToConfEventModel(request_data['conferences'][0]['conference_name_abbr'])

            return(Response(""))
        else:
            serializer = self.serializer_class(data=request_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            confutils.addDataToConfEventModel(request_data['conferences'][0]['conference_name_abbr'])
            return Response(serializer.data)

'''
BAB get conf events/years
'''
# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 

class searchConfView(APIView):
    def get(self, request, format=None):
        preloadedConferenceList = PreloadedConferenceList.objects.all()
        serializer = PreloadedConferenceListSerializer(preloadedConferenceList, many=True)
        return Response(serializer.data)
        
        #data = Conference_Event.objects.all()
        #return data
    



'''
BAB get conf events/years
'''
# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 

class confEvents(APIView):
    def get(self, request, *args, **kwargs):

        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        #print("The year is:",year)
        return Response({
            "years":
            getConfEvents(topics_split[-1])
        })

'''
View regarding topic wordcloud
'''

#BAB 08.06.2021 Extension for other conferences other than LAK

class TopicsView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = TopicSerializer
        #print("The serializer is:",serializer_class)
        #print(applyTopicMining())
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        #print("The year is:",year)
        return Response({
            "topics":
            applyTopicMiningTopic(topics_split[-3],topics_split[-1], topics_split[-2])
        })


'''
View regarding keyword topic cloud
'''

#BAB 08.06.2021 Extension for other conferences other than LAK

class KeywordsView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = TopicSerializer
        #print("The serializer is:",serializer_class)
        #print(applyTopicMining())
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        #print("The year is:",year)
        return Response({
            "keywords":
            applyTopicMiningKeyword(topics_split[-1],topics_split[-1], topics_split[-2])
        })


class AllTopicsViewDB(APIView):
    def get(self, request, *args, **kwargs):
        yearList = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
        algorithm = "Yake"
        return Response({"dbupdate": fetchAllTopics(yearList, algorithm)})


'''
View for the bar chart top 10 keywords/top 10 publications
'''

#BAB
class TopicBarView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = DictSerializer
        url_path = request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({"keywords": getTopKeywords(topics_split[-2], topics_split[-1])})


'''
View for the bar chart top 10 topics/top 10 publications
'''

#BAB
class TopicBarViewTopics(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = DictSerializer
        url_path = request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({"keywords": getTopTopics(topics_split[-2],topics_split[-1])})


class populateTopicView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = TopicSerializer
        url_path = request.get_full_path()
        year = url_path[-4:]
        return Response({"topicsdict": getPaperswithTopics(year)[1]})


class populateKeyView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = TopicSerializer
        url_path = request.get_full_path()
        year = url_path[-4:]
        return Response({"topicsdict": getPaperswithKeys(year)[1]})


class getTopicBarValues(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = JSONSerialize
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        topics_split = url_path.split(r"/")
        print(topics_split)
        print(topics_split[-2])
        print(topics_split[-1])
        return Response(
            {"docs": getTopicDetails(topics_split[-2], topics_split[-1])})


class getKeyBarValues(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = JSONSerialize
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        topics_split = url_path.split(r"/")
        return Response(
            {"docs": getKeyDetails(topics_split[-2], topics_split[-1])})


class vennPlotView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"set": compareTopics("2013", "2012")})


class allTopics(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        return Response({"topics": getAllTopicsAllYears(topics_split[-1])})


class allKeys(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        return Response({"topics": getAllKeywordsAllYears(topics_split[-1])})


class AllTopicDicts(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "weights": getTopicWeightsAllYears(topics_split[-1])[0],
            "years": getTopicWeightsAllYears(topics_split[-1])[1]
        })


'''
View to get topics for the pie chart
'''

#BAB
class TopicPieView(APIView):
    def get(self, request, *args, **kwargs):
       # serializer_class = TopicSerializer
        url_path = request.get_full_path()

        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        year = topics_split[-1]

        num = topics_split[-2]
        
        conferenceName = topics_split[-3]
        return Response({
            "topics": getDataForPieTopics(conferenceName,year, num)[0],
            "weights": getDataForPieTopics(conferenceName,year, num)[1]
        })


'''
View to get keyword data for pie chart
'''

#BAB
class KeyPieView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = TopicSerializer
        url_path = request.get_full_path()
        url_path = request.get_full_path()

        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        year = topics_split[-1]

        num = topics_split[-2]
        conferenceName = topics_split[-3]

        return Response({
            "keys": getDataForPieKeys(conferenceName,year, num)[0],
            "weights": getDataForPieKeys(conferenceName,year, num)[1]
        })


'''
View to get topics for stacked area chart- topic evolution
'''

#BAB
class MultipleTopicAreaView(APIView):
    def get(self, request, *args, **kwargs):

        url_path = request.get_full_path()
        #print("the url path is:",url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split("?")
        print(topics_split[1])
        topics_split_params = topics_split[1].split("&")
        topics_split_conferenceName = topics_split_params[1].split("/")
        print(topics_split_params, "*********************")
        #listoftopics=["Learning","Analytics"]
        #getKeyWeightsAllYears
        return Response({
            "weights":
            getMultipleYearTopicJourney(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])[0],
            "years":
            getMultipleYearTopicJourney(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])[1]
        })


'''
View to get keywords for stacked area chart- topic evolution
'''

#BAB conference name must be modfified for more tha 2 topics

class MultipleKeyAreaView(APIView):
    def get(self, request, *args, **kwargs):

        url_path = request.get_full_path()

        url_path = url_path.replace("%20", " ")
        print("the url path is:", url_path)
        topics_split = url_path.split("?")
        print(topics_split[1])
        topics_split_params = topics_split[1].split("&")
        topics_split_conferenceName = topics_split_params[1].split("/")

        print(topics_split_params, "*********************")
        #listoftopics=["Learning","Analytics"]
        #getKeyWeightsAllYears
        return Response({
            "weights":
            getMultipleYearKeyJourney(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])[0],
            "years":
            getMultipleYearKeyJourney(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])[1]
        })


class FetchPaperView(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = TopicSerializer
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")

        print(url_path.find(r"/"))
        count_slash = url_path.count(r"/")
        topics_split = url_path.split("!")
        val = ""
        if count_slash > 4:
            val = topics_split[-2]
        else:
            val = topics_split[-1]
        return Response({'url': getPaperIDFromPaperTitle(topics_split[-1])})



class AuthorsFetchView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"authors": getAllAuthors()})


class AuthorsDictFetchView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"authors": getAllAuthorsDict()})


class TopicOverview(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"overview": getTopicEvoultion()})


'''
View to obtain topics for Author Conference Venn Diagram
'''


class AuthorConfComparisionView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = unquote(url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "compare":
            authorConfTopicComparison(topics_split[-3], topics_split[-2],
                                      topics_split[-1])
        })


'''
View to obtain common topics for the conference venn diagram
'''


class VennOverview(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        #url_path=url_path.replace("%20"," ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "commontopics":
            generateVennData(topics_split[-3],topics_split[-2], topics_split[-1])
        })


'''
View to obtain common keywords for conference venn diagram
'''


class VennOverviewKeys(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        #url_path=url_path.replace("%20"," ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "commontopics":
            generateVennDataKeys(topics_split[-3],topics_split[-2], topics_split[-1])
        })


'''
get all keywords for the author network
'''


class AllKeywordsView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({"keywords": getAllKeywords(topics_split[-1])})


'''
get all topics for author network
'''


class AllTopicsView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({"keywords": getAllTopics(topics_split[-1])})


'''
View to get keywords for the author network
'''


class SearchKeywordView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response(
            {"titles": searchForKeyword(topics_split[-1], topics_split[-2])})


'''
View to get topics for the author network
'''


class SearchTopicView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response(
            {"titles": searchForTopics(topics_split[-1], topics_split[-2])})


'''
View to get topic data for the stacked bar chart across years
'''

#BAB
class FetchTopicView(APIView):
    def get(self, request, *args, **kwargs):
        print('BAB')

        url_path = request.get_full_path()
        #print("the url path is:",url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split("?")
        topics_split_params = topics_split[1].split("&")
        topics_split_conferenceName = topics_split_params[1].split("/")
        print('BAB')
        print('BAB',topics_split_conferenceName[-1])
        print('BAB')
        #getTopKeysForAllYear
        return Response(
            {"Topiclist": getTopTopicsForAllYears(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])})


'''
View to get keyword data for the stacked bar chart across years
'''


class FetchKeyView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        #print("the url path is:",url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split("?")

        topics_split_params = topics_split[1].split("&")
        topics_split_conferenceName = topics_split_params[1].split("/")

        print(topics_split_params)
        #getTopKeysForAllYear
        return Response(
            {"Topiclist": getTopKeysForAllYear(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])})


class UpdateAllTopics(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"alltpcs": updateAllTopics()})


class FetchAuthorView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        url_path = unquote(url_path)
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "authors":
            getAuthorFromAuthorName(topics_split[-3], topics_split[-2],
                                    topics_split[-1])
        })


class OverviewChartViewTopics(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "topicoverview":
            getFlowChartDataTopics(topics_split[-1], topics_split[-2])
        })


class OverviewChartViewKeywords(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "keyoverview":
            getFlowChartDataKeywords(topics_split[-1], topics_split[-2])
        })

#BAB 08.06.2021 Extension for other conferences other than LAK

class FetchAbstractView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        
        print('BAB')
        print('split ', topics_split)
        print('split -1 ',topics_split[-1])
        print('split -2 ',topics_split[-2])
        print('split -3 ',topics_split[-3])

        print('BAB')
        return Response({
            "abstractview":
            getAbstractbasedonKeyword(topics_split[-3],topics_split[-1], topics_split[-2])
        })


'''
View to get topic details of Author
'''


class AuthorFetchYearView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({"authors": getAuthorsForYear(topics_split[-1])})


'''
View to get topic details
'''


class AuthorTopicComparisonView(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        # print(request.user)
        # for user in User.objects.all():
        #     print(user)
        #     token,created=Token.objects.get_or_create(user=user)
        #     print(token.key)
        # print("user:",request.user)
        url_path = request.get_full_path()
        url_path = unquote(url_path)

        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split("?")
        topics_split_params = topics_split[1].split("&")
        print(topics_split_params)
        return Response({
            "authortopics":
            compareAuthors(topics_split_params[-4], topics_split_params[-3],
                           topics_split_params[-2], topics_split_params[-1])
        })


        #return Response({"authortopics":getDataAuthorComparisonTopics(topics_split_params[-1],topics_split_params[-3],topics_split_params[-2])})
class AuthorKeywordComparisonView(APIView):
    def get(self, request, *args, **kwargs):
        print(request)
        url_path = request.get_full_path()
        #print("the url path is:",url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split("?")
        topics_split_params = topics_split[1].split("&")
        print(topics_split_params)
        return Response({
            "authortopics":
            getDataAuthorComparisonKeywords(topics_split_params[-1],
                                            topics_split_params[-3],
                                            topics_split_params[-2])
        })


class CompareAuthorConf(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response(
            {"papers": fetchTopicsuserID(topics_split[-1], topics_split[-2])})


class AuthorDBInsertView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"dbinsert": fetchAbstracts_author()})


class AuthorComparisonData(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "authortopics":
            getAuthorComparisionData(topics_split[-2], topics_split[-1])
        })


class FetchAuthorsDict(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"authors": getAuthorsDict()})


class AuthorConfComparisonData(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "vals":
            compareLAKwithAuthortopics(topics_split[-2], topics_split[-1])
        })


#created by mouadh, sorting tweets based on similarity score
class similartweets(APIView):
    def get(self, request, *args, **kwargs):

        return Response({"vals": getsimilarity()})
