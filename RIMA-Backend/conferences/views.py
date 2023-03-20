# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK
# test import BEGIN
from neo4j import GraphDatabase
import re
from itertools import combinations
import itertools
from django.conf.urls import url
from matplotlib.pyplot import uninstall_repl_displayhook
from .DataExtractor import ConferenceDataCollector as dataCollector
from . import ConferenceUtils as confutils
import datetime
import json
from django.conf import settings

from . import tests
from collections import OrderedDict
from django.urls import conf, reverse
from django.conf import settings
from django.http.response import HttpResponse
from rest_framework.views import APIView
from urllib.parse import unquote
from django.http import JsonResponse
from rest_framework.response import Response
from .topicutils import (
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
    get_abstract_based_on_keyword,
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
    getAuthorsDict,  # printText
    getConfEvents)  # BAB 08.06.2021::Extension for other conferences other than LAK
from .TopicExtractor import (
    fetchAllTopics, fetchAbstracts_author, updateAllTopics)
from .serializers import PreloadedConferenceListSerializer, ConferenceSerializer, PlatformSerializer, ConferenceEventSerializer
from rest_framework.generics import (ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView,
                                     DestroyAPIView, ListAPIView,
                                     RetrieveAPIView, CreateAPIView)

from .ConferenceUtilsCql import (CreateDatabaseLabels, DeleteConference, GetAuthorByName, GetAuthorKeyword, GetAuthorPapers, GetAuthorTopic, GetAuthorsOfPaper, GetConferenceAuthors, GetConferences, GetEventAuthors, GetEventData, GetConferenceEvents, GetEventPapers, UpdateConferenceEvent, CreateAuthor,
                                 CreateConference, CreateEvent, Create_has_event, CreateAuthor, CreatePaper, Author_has_paper, Conference_has_paper, Event_has_paper, Event_has_author)

from .models import Platform, Conference, Conference_Event, PreloadedConferenceList, Conference_Event_Paper, Author, Author_has_Papers
from django.db.models import Q

from matplotlib_venn import venn2, venn2_circles, venn2_unweighted
from matplotlib import pyplot as plt
import matplotlib
from collections import defaultdict
from sklearn.preprocessing import StandardScaler, MinMaxScaler, Normalizer, RobustScaler
import time
matplotlib.use("SVG")


class conferenceGeneralDataView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_name_abbr = url_splits[-1]
        result_data = confutils.get_conference_general_data(
            conference_name_abbr)
        # tests.TimeComplexity(conferenceGeneralDataView)
        # print("conferenceGeneralDataView:", result_data)
        return Response(result_data)


class constructDatabase(APIView):
    def post(self, request, *args, **kwargs):
        session = settings.NEO4J_SESSION.session()
        session.execute_write(CreateDatabaseLabels)
        return Response({})


class testGeneralDataView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_name_abbr = url_splits[-1]
        time = tests.TimeComplexity(
            confutils.testconference)
        return Response(time)


class conferencesNamesView(APIView):
    def get(self, request, *args, **kwargs):

        models_data = []
        result_data = []

        models_data = confutils.get_conferences_list()

        for data in models_data:
            result_data.append({
                'value': data['conference_name_abbr'],
                'label': data['conference_name_abbr']
            })

        return Response(result_data)


class conferencesSharedWordsView(ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        result_data = []
        models_data = []
        conferences_list = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark[1], r'&')
        keyword_or_topic = confutils.split_restapi_url(
            url_splits_question_mark[0], r'/')[-2]

        models_data = confutils.get_shared_words_between_conferences(
            conferences_list, keyword_or_topic)

        for word in models_data:
            result_data.append({
                'value': word,
                'label': word,
            })
        return Response({'words': result_data})


class SharedWordEvolutionView(APIView):
    def get(self, request, *args, **kwargs):
        models_data = []
        result_data = []
        weights = []
        years_range = []
        all_models_data = []
        session = settings.NEO4J_SESSION.session()

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark[1], r'&')
        keyword_or_topic = confutils.split_restapi_url(
            url_splits_question_mark[0], r'/')[-3]
        word = confutils.split_restapi_url(
            url_splits_question_mark[0], r'/')[-2]

        for conference in conferences_list:
            # conference_obj = Conference.objects.get(
            #     conference_name_abbr=conference)
            conference_event_objs = session.execute_read(
                GetConferenceEvents, conference)
            # Conference_Event.objects.filter(
            #     conference_name_abbr=conference_obj)
            models_data = confutils.get_word_weight_event_based(
                conference_event_objs, word, keyword_or_topic)
            for model_data in models_data:
                years_range.append(model_data['year'])
            all_models_data.append(models_data)

        years_range = sorted(list(set(years_range)))

        for year in years_range:
            for data in all_models_data:
                ocurrence_list = list(
                    filter(lambda inner_data: inner_data['year'] == year, data))
                if ocurrence_list:
                    # print('test_list')
                    sum_weight = 0
                    for result in ocurrence_list:
                        sum_weight += result['weight']
                        print(result)
                    weights.append(sum_weight)
                    sum_weight = 0
                    # print('test_list')
                else:
                    weights.append(0)

            result_data.append(weights)
            weights = []

        # print('result_data')
        # print(all_models_data)
        # print('++++++++++++++++++')
        # print(result_data)
        # print('++++++++++++++++++')
        # print(years_range)
        # print('result_data')

        return Response({"weights": result_data,
                         "years": years_range
                         })


class conferencesYearsRangeView(APIView):

    def get(self, request, *args, **kwargs):
        result_data = []
        models_data = []
        conferences_list = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark[1], r'&')

        models_data = confutils.get_years_range_of_conferences(
            conferences_list, 'shared')

        for word in models_data:
            result_data.append({
                'value': word,
                'label': word,
            })

        # print('result_dat')
        # print(result_data)
        # print('result_data')

        return Response({'years': result_data})


class conferenceDeleteView(APIView):
    # serializer_class = ConferenceSerializer

    def delete(self, request, pk):
        session = settings.NEO4J_SESSION.session()

        print(pk)
        conference_name_abbr = pk
        print(pk)
        # confutils.delete_conference_data(conference_name_abbr)
        session.execute_write(DeleteConference, conference_name_abbr)
        session.close()
        return Response({})


class conferenceDeleteView1(APIView):
    serializer_class = ConferenceSerializer

    def delete(self, request, pk):
        # session = settings.NEO4J_SESSION.session()

        print(pk)
        conference_name_abbr = pk
        print(pk)
        confutils.delete_conference_data(conference_name_abbr)
        # session.execute_write(DeleteConference, conference_name_abbr)
        # session.close()
        tests.TimeComplexity()
        return Response({})


class conferencesSharedWordsBarView(APIView):
    def get(self, request, *args, **kwargs):
        result_data = [[], []]
        conferences_events_list = []
        avaiable_events = []
        not_available_events = []
        session = settings.NEO4J_SESSION.session()
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'?')
        conferences_list = confutils.split_restapi_url(url_splits[-1], r'&')
        year = confutils.split_restapi_url(url_splits[-2], r'/')[-2]
        keyword_or_topic = confutils.split_restapi_url(
            url_splits[-2], r'/')[-3]

        for conference in conferences_list:
            conferences_events_list.append(conference+year)
            if int(year) < 2000:
                conferences_events_list.append(conference+year[2:])

        for conference_event in conferences_events_list:
            # event_is_available = Conference_Event.objects.filter(
            #     Q(conference_event_name_abbr__icontains=conference_event)).exists()
            # if event_is_available:
            # model_events = session.execute_read(
            #     GetConferenceEvents, conference_event)
            # # model_events = Conference_Event.objects.filter(
            # #     Q(conference_event_name_abbr__icontains=conference_event))
            # for model_event in model_events:
            avaiable_events.append(conference_event)
            # else:
            #     not_available_events.append(conference_event)

        # print(conferences_list)
        # print(year)
        # print(keyword_or_topic)
        # print(conferences_events_list)
        # print('AVAILABLE', list(set(avaiable_events)))
        # print('NOT AVAILABLE', list(set(not_available_events)))

        result_data = confutils.get_shared_words_between_events(
            avaiable_events, keyword_or_topic)
        result_data[0] = sorted(
            result_data[0], key=lambda k: k['weight'], reverse=True)

        sorted_data = [result_data[0][:5], result_data[1]]
        # print('result_dat')
        # print(sorted_data)
        # print('result_data')

        return Response({'Topiclist': sorted_data})


# under work timeline
class DataTimeLineChartView(APIView):
    def get(self, request, *args, **kwargs):
        result_data = []
        conference_all_models_words = []
        conferences_all_events = []
        session = settings.NEO4J_SESSION.session()

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'?')
        keyword_or_topic = url_splits[0].split('/')[-2]
        conferences_list = url_splits[1].split('&')

        print(keyword_or_topic)
        print(conferences_list)

        for conference in conferences_list:
            conference_based_result_data = {
                'name': conference,
                'data': []
            }
            conference_events = session.execute_read(
                GetConferenceEvents, conference)
            # Conference_Event.objects.filter(
            #     conference_name_abbr=conference)
            for conference_event in conference_events:
                if keyword_or_topic == 'topic':
                    models_data = confutils.get_topics_from_models(
                        conference_event.get('conference_event_name_abbr'))
                elif keyword_or_topic == 'keyword':
                    models_data = confutils.get_keywords_from_models(
                        conference_event.get('conference_event_name_abbr'))

                for data in models_data[:5]:
                    # print(data)
                    year = re.sub(
                        "[^0-9]", "", conference_event.get('conference_event_name_abbr').split('-')[0])
                    conference_based_result_data['data'].append({
                        'x': data.get(keyword_or_topic),
                        'y': [
                            year,
                            year + "-12-31"
                            # str(int(year)+1)
                        ]
                    })

            result_data.append(conference_based_result_data)

        # print('##############', ' result data ', '####################')
        # print(result_data)
        # print('##############', ' result data ', '####################')
        return Response({'data': result_data})


"""
BAB Conference Events views
"""


class ConferenceEventsView(ListCreateAPIView):

    def get(self, request, *args, **kwargs):
        session = settings.NEO4J_SESSION.session()

        data = []
        url_path = self.request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")

        conference_events_objs = session.execute_read(
            GetConferenceEvents, topics_split[-1])
        for x in range(len(conference_events_objs)):
            c = session.execute_read(
                GetEventPapers, conference_events_objs[x].get('conference_event_name_abbr'))

            info = {
                "conference_event_name_abbr": conference_events_objs[x].get('conference_event_name_abbr'),
                "conference_event_url": conference_events_objs[x].get('conference_event_url'),
                "no_of_stored_papers": len(c),
                "conference_name_abbr": conference_events_objs[x].get('conference_name_abbr'),
            }
            data.append(info)

        session.close()

        return Response(data)


"""
BAB Conference Events views
"""


class CollectEventPapersView(ListCreateAPIView):

    def get(self, request, *args, **kwargs):
        data = [{}]
        url_path = self.request.get_full_path()
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        # print("asd", topics_split[-2], topics_split[-1])
        confutils.add_data_to_conf_paper_and_author_models2(
            topics_split[-2], topics_split[-1])
        return Response(data)


"""
BAB Conference Events views
"""


class ExtractEventTrendsView(ListCreateAPIView):

    def get(self, request, *args, **kwargs):
        data = [{}]
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name_abbr = url_splits[-1]

        confutils.add_data_to_conference_keyword_and_topic_models(
            conference_event_name_abbr)
        return Response(data)


class ExtractAuthorsTrendsView(ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        data = [{}]
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name_abbr = url_splits[-1]

        # print(url_splits)
        # print(conference_event_name_abbr)
        confutils.add_data_to_author_keyword_and_topic_models(
            conference_event_name_abbr)
        return Response(data)


'''
BAB Add Conference View

'''


class addConferenceView(APIView):

    def get(self, request, *args, **kwargs):
        data = []
        data = confutils.get_conferences_list()
        return Response(data)

    def post(self, request, *args, **kwargs):
        session = settings.NEO4J_SESSION.session()
        request_data = self.request.data
        session.execute_write(CreateDatabaseLabels)
        try:
            session.execute_write(
                CreateConference, f"{request_data['conferences'][0]['conference_name_abbr']}", f"{request_data['conferences'][0]['conference_url']}", f"{request_data['platform_name']}", f"{request_data['platform_url']}")
        except:
            print(
                f"{request_data['conferences'][0]['conference_name_abbr']}" " already exist")

        confutils.add_data_to_conf_event_model2(
            request_data['conferences'][0]['conference_name_abbr'])
        session.close()
        return Response({
            "platform_name": f"{request_data['platform_name']}",
            "platform_url": f"{request_data['platform_url']}",
            "conferences": [{
                "conference_name_abbr": f"{request_data['conferences'][0]['conference_name_abbr']}",
                "conference_url": f"{request_data['conferences'][0]['conference_url']}"
            }]
        })


class searchConfView(APIView):
    def get(self, request, format=None):
        preloadedConferenceList = PreloadedConferenceList.objects.all()
        serializer = PreloadedConferenceListSerializer(
            preloadedConferenceList, many=True)
        return Response(serializer.data)


'''
BAB get conf events/years
'''
# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK
# modified 04.07.2021


class confEvents(APIView):
    def get(self, request, *args, **kwargs):
        # print("@@@@@@@@@@@@@@@@@@@")
        url_path = request.get_full_path()
        # print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        # print("topics_split:", topics_split)
        #print("The year is:",year)
        conferences_events_JSON = []
        session = settings.NEO4J_SESSION.session()
        conference_events = session.execute_read(
            GetConferenceEvents, conference_name_abbr=topics_split[-1])
        # Conference_Event.objects.filter(conference_name_abbr=topics_split[-1]).values_list(
        #     'conference_event_name_abbr',
        #     flat=True)
        # print('33333333', conference_events)

        for event in conference_events:
            conferences_events_JSON.append({
                'value': event.get("conference_event_name_abbr"),
                'label': event.get("conference_event_name_abbr"),
            })
        # print('2222222', conferences_events_JSON)
        session.close()
        return Response({
            "events":
            conferences_events_JSON
        })


class conferenceAuthors(APIView):
    def get(self, request, *args, **kwargs):
        result_data = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_name_abbr = url_splits[-1]

        result_data = confutils.get_authors_data(conference_name_abbr)
        return Response(result_data)


class AuthorPublications(APIView):
    def get(self, request, *args, **kwargs):
        result_data = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        author_id = url_splits[-1]
        conference_name_abbr = url_splits[-2]

        result_data = confutils.get_author_publications_in_conf(
            author_id, conference_name_abbr)
        return Response(result_data)


'''
View regarding topic wordcloud
'''

# BAB 08.06.2021 Extension for other conferences other than LAK
# modified 04.07.2021


class WordCloudView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        keyword_or_topic = url_splits[-3]
        number = url_splits[-2]
        conference_event_name_abbr = url_splits[-1]
        result_data = []

        if keyword_or_topic == "topic":

            models_data = confutils.get_topics_from_models(
                conference_event_name_abbr)

        elif keyword_or_topic == "keyword":
            models_data = confutils.get_keywords_from_models(
                conference_event_name_abbr)
        print(models_data)
        if number == '5':
            reduced_models_data = models_data[:5]
        elif number == '10':
            reduced_models_data = models_data[:10]

        for model_data in reduced_models_data:
            result_data.append({
                "text": model_data.get(keyword_or_topic),
                "value": model_data.get('weight'),

            })
        return Response({
            "words":
            result_data
        })


class AuthorWordCloudView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        keyword_or_topic = url_splits[-4]
        number = url_splits[-3]
        conference_name_abbr = url_splits[-2]
        author_id = url_splits[-1]
        inter_data = []
        result_data = []
        publications_list = confutils.get_author_publications_in_conf(
            author_id, conference_name_abbr)

        # print('publications_list')
        # print(len(publications_list))
        # print('publications_list')

        # if keyword_or_topic == "topic":
        #     extracted_data = confutils.get_author_interests(
        #         publications_list, author_id, keyword_or_topic)
        # elif keyword_or_topic == "keyword":
        #     extracted_data = confutils.get_author_interests(
        #         publications_list, author_id, keyword_or_topic)
        extracted_data = confutils.get_author_interests(
            publications_list, author_id, keyword_or_topic)
        if keyword_or_topic == "topic":
            for data in extracted_data:
                inter_data.append({
                    "text": data.get('topic'),
                    "value": data.get('weight'),
                })
        elif keyword_or_topic == "keyword":
            for data in extracted_data:
                inter_data.append({
                    "text": data.get('keyword'),
                    "value": data.get('weight'),
                })

        sorted_data = sorted(
            inter_data, key=lambda k: k['value'], reverse=True)
        print(sorted_data)
        if number == '5':
            sorted_data = sorted_data[:5]
            print(sorted_data, "sorteeeed")

        elif number == '10':
            sorted_data = sorted_data[:10]

        return Response({
            "words":
            sorted_data
        })


'''
View to get topics for the pie chart
'''

# BAB


class TopicPieView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        keyword_or_topic = url_splits[-3]
        # print('keyword_or_topic:', keyword_or_topic)
        number = url_splits[-2]
        # print("number:", number)
        conference_event_name_abbr = url_splits[-1]
        # print('conference_event_name_abbr', conference_event_name_abbr)
        list_words = []
        list_weights = []

        result_dict = {}
        result_dict['words'] = []
        result_dict['weights'] = []

        if keyword_or_topic == "topic":
            models_data = confutils.get_topics_from_models(
                conference_event_name_abbr)

        elif keyword_or_topic == "keyword":
            models_data = confutils.get_keywords_from_models(
                conference_event_name_abbr)

        if number == '5':
            reduced_models_data = models_data[:5]
        elif number == '10':
            reduced_models_data = models_data[:10]

        # print("reduced_models_data:", reduced_models_data)

        for model_data in reduced_models_data:
            # print(model_data[keyword_or_topic])
            result_dict['words'].append(model_data.get(keyword_or_topic))
            result_dict['weights'].append(model_data.get('weight'))
        return Response(result_dict)


'''
View to get topic data for the stacked bar chart across years
'''

# BAB


class FetchTopicView(APIView):
    def get(self, request, *args, **kwargs):
        result_data = [[], []]
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        url_splits_topic_keyword = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        keyword_or_topic = url_splits_topic_keyword[-2]
        # print('CHECK URL', url_splits_topic_keyword[-2])
        topics_split_params = url_splits_question_mark[-1].split("&")

        print(topics_split_params)
        result_data = confutils.get_shared_words_between_events(
            topics_split_params, keyword_or_topic)
        result_data[0] = sorted(
            result_data[0], key=lambda k: k['weight'], reverse=True)

        sorted_data = [result_data[0][:5], result_data[1]]
        return Response(
            {"Topiclist": sorted_data})


'''
View to get keyword data for the stacked bar chart across years
'''


class FetchKeyView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'?')
        print('CHECK URL', request.get_full_path())
        topics_split_params = url_splits[-1].split("&")

        # print(topics_split_params)
        # getTopKeysForAllYear
        return Response(
            {"Topiclist": getTopKeysForAllYear("", topics_split_params)})


'''
View to get keyword data for pie chart
'''

# BAB
# to be removed


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
            "keys": getDataForPieKeys(conferenceName, year, num)[0],
            "weights": getDataForPieKeys(conferenceName, year, num)[1]
        })


'''
View regarding keyword topic cloud
'''


class AllTopicsViewDB(APIView):
    def get(self, request, *args, **kwargs):
        yearList = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
        algorithm = "Sifrank"
        return Response({"dbupdate": fetchAllTopics(yearList, algorithm)})


'''
View for the bar chart top 10 keywords/top 10 publications
'''

# BAB
# modified


class TopicBarView(APIView):
    def get(self, request, *args, **kwargs):

        list_words = []
        list_weights = []
        result_dict = {}
        result_dict['keywords'] = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name_abbr = url_splits[-1]
        keyword_or_topic = url_splits[-2]
        # print('conference_event_name_abbr:', conference_event_name_abbr)
        # print('keyword_or_topic:', keyword_or_topic)

        if keyword_or_topic == 'keyword':
            models_data = confutils.get_keywords_from_models(
                conference_event_name_abbr)
        elif keyword_or_topic == 'topic':
            models_data = confutils.get_topics_from_models(
                conference_event_name_abbr)

        for model_data in models_data[:10]:
            list_words.append(model_data.get(keyword_or_topic))
            list_weights.append(model_data.get('weight'))

        result_dict['keywords'].append(list_words)
        result_dict['keywords'].append(list_weights)

        return Response(result_dict)

# BAB
# modified


class getTopicBarValues(APIView):
    def get(self, request, *args, **kwargs):
        abstract_title_str = ""
        abstracts_titles = []
        list_papers_titles = []
        helper_list = []
        list_freq = []
        result_dict = {}
        result_dict['docs'] = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name_abbr = url_splits[-1]
        word = url_splits[-2]
        KeywordOrTopic = url_splits[-3]
        # print("::::::::::", KeywordOrTopic, word, conference_event_name_abbr)
        abstracts_titles = confutils.get_abstract_based_on_keyword(
            conference_event_name_abbr, word, KeywordOrTopic)

        for abstract_title in abstracts_titles:
            if (abstract_title.get('abstract')):
                abstract_title_str = abstract_title.get('title') + \
                    abstract_title.get('abstract')
            else:
                abstract_title_str = abstract_title.get('title')

            helper_list.append({
                'title': abstract_title.get('title'),
                'term_frequency': abstract_title_str.lower().count(word.lower())
            })

        helper_list = sorted(
            helper_list, key=lambda k: k['term_frequency'], reverse=True)
        for item in helper_list[:10]:
            list_papers_titles.append(item['title'])
            list_freq.append(item['term_frequency'])

        result_dict['docs'].append(list_papers_titles)
        result_dict['docs'].append(list_freq)
        # print('#######################################',
        #       result_dict['docs'][0], '############################')
        # print('#######################################',result_dict['docs'][1],'############################')
        return Response(result_dict)


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


class getKeyBarValues(APIView):
    def get(self, request, *args, **kwargs):
        #serializer_class = JSONSerialize
        url_path = request.get_full_path()
        # print("the url path is:", url_path)
        topics_split = url_path.split(r"/")
        return Response(
            {"docs": getKeyDetails(topics_split[-2], topics_split[-1])})


class vennPlotView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"set": compareTopics("2013", "2012")})

# modified Area chart


class allWords(APIView):
    def get(self, request, *args, **kwargs):
        # print('####################################')

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_name_abbr = url_splits[-1]
        keyword_or_topic = url_splits[-2]

        models_data = []
        result_data_with_duplicates = []
        result_data = []
        session = settings.NEO4J_SESSION.session()

        conference_events_objs = session.execute_read(
            GetConferenceEvents, conference_name_abbr)
        # Conference_Event.objects.filter(
        #     conference_name_abbr=conference_name_abbr)
        for conference_event_obj in conference_events_objs:
            if keyword_or_topic == 'topic':
                models_data = confutils.get_topics_from_models(
                    conference_event_obj.get('conference_event_name_abbr'))
            elif keyword_or_topic == 'keyword':
                models_data = confutils.get_keywords_from_models(
                    conference_event_obj.get('conference_event_name_abbr'))

            for model_data in models_data:
                result_data_with_duplicates.append(
                    model_data.get(keyword_or_topic))

        # print('####################################')
        # print(list(set(result_data_with_duplicates)))
        # print('####################################')

        result_data = [{
            "value": val,
            "label": val
        } for val in list(set(result_data_with_duplicates))]
        session.close()
        return Response({"topics": result_data})

# To be removed Area chart


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
View to get topics for stacked area chart- topic evolution
'''

# BAB


class MultipleTopicAreaView(APIView):
    def get(self, request, *args, **kwargs):
        session = settings.NEO4J_SESSION.session()
        models_data = []
        result_data = []
        weights = []
        events = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        url_splits_conference_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        conference_name_abbr = url_splits_conference_name[-2]
        # print('CHECK URL', url_splits_conference_name[-2])
        words_split_params = url_splits_question_mark[-1].split("&")
        # print('CHECK URL', url_splits_question_mark[-1].split("&"))

        keyword_or_topic = 'topic'

        # conference_obj = Conference.objects.get(
        #     conference_name_abbr=conference_name_abbr)
        conference_event_objs = session.execute_read(
            GetConferenceEvents, conference_name_abbr)
        # Conference_Event.objects.filter(
        #     conference_name_abbr=conference_obj)

        for word in words_split_params:
            models_data = confutils.get_word_weight_event_based(
                conference_event_objs, word, url_splits_conference_name[-3])
            for model_data in models_data:
                weights.append(model_data['weight'])
                events.append(model_data['conference_event_abbr'])
            result_data.append(weights)
            weights = []

        # print('result_data')
        # print(result_data)
        # # list(sorted(set(events), key=events.index))
        # print(list(sorted(set(events), key=events.index)))
        # print('result_data')
        # listoftopics=["Learning","Analytics"]
        # getKeyWeightsAllYears
        session.close()
        return Response({
            # getMultipleYearTopicJourney(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])[0]
            "weights": result_data,
            "years": list(sorted(set(events), key=events.index))
            # getMultipleYearTopicJourney(topics_split_conferenceName[1],[topics_split_params[0],topics_split_conferenceName[0]])[1]
        })


'''
View to get keywords for stacked area chart- topic evolution
'''

# BAB conference name must be modfified for more tha 2 topics


class MultipleKeyAreaView(APIView):
    def get(self, request, *args, **kwargs):

        url_path = request.get_full_path()

        url_path = url_path.replace("%20", " ")
        # print("the url path is:", url_path)
        topics_split = url_path.split("?")
        print(topics_split[1])
        topics_split_params = topics_split[1].split("&")
        topics_split_conferenceName = topics_split_params[1].split("/")

        # print(topics_split_params, "*********************")
        # listoftopics=["Learning","Analytics"]
        # getKeyWeightsAllYears
        return Response({
            "weights":
            getMultipleYearKeyJourney(topics_split_conferenceName[1], [
                                      topics_split_params[0], topics_split_conferenceName[0]])[0],
            "years":
            getMultipleYearKeyJourney(topics_split_conferenceName[1], [
                                      topics_split_params[0], topics_split_conferenceName[0]])[1]
        })

# modified BAB


class FetchPaperView(APIView):
    def get(self, request, *args, **kwargs):
        session = settings.NEO4J_SESSION.session()
        title = ""
        url_spilts = confutils.split_restapi_url(request.get_full_path(), r'/')
        title = url_spilts[-1]
        # print(url_spilts[-1], 'URL REQUEST TEST')
        conference_event_paper_obj = session.execute_read()
        Conference_Event_Paper.objects.get(
            Q(title__icontains=title))
        session.close()
        # print("URL TEST ", conference_event_paper_obj.url, "URL TEST")
        return Response({'url': conference_event_paper_obj.url})


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
View to obtain common topics for the conference venn diagram
'''


class VennOverview(APIView):
    def get(self, request, *args, **kwargs):
        words_first_event = []
        words_second_event = []
        words_intersect_second_event = []
        models_data_first_event = []
        models_data_second_event = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')

        first_event = url_splits[-2]
        second_event = url_splits[-1]
        keyword_or_topic = url_splits[-3]
        # print('VennOverviewfirst_event:', first_event)
        # print('VennOverviewsecond_event:', second_event)
        if keyword_or_topic == 'topic':
            models_data_first_event = confutils.get_topics_from_models(
                first_event)
            models_data_second_event = confutils.get_topics_from_models(
                second_event)

        elif keyword_or_topic == 'keyword':
            models_data_first_event = confutils.get_keywords_from_models(
                first_event)
            models_data_second_event = confutils.get_keywords_from_models(
                second_event)

        for data in models_data_first_event:
            words_first_event.append(data.get(keyword_or_topic))

        for data in models_data_second_event:
            words_second_event.append(data.get(keyword_or_topic))

        models_data_intersect_first_and_second = confutils.get_shared_words_between_events(
            [first_event, second_event], keyword_or_topic)

        if len(models_data_intersect_first_and_second) > 0:
            for data in models_data_intersect_first_and_second[0]:
                words_intersect_second_event.append(data['word'])

        ctx = confutils.generate_venn_photo(
            words_first_event[0:10], words_second_event[0:10], words_intersect_second_event[0:10], first_event, second_event, keyword_or_topic)

        return Response({
            "commontopics": ctx
        })


'''
View to obtain topics for Author Conference Venn Diagram
'''


class AuthorConfComparisionView(APIView):
    def get(self, request, *args, **kwargs):
        words_conferemce_event = []
        words_author = []
        models_data_conference_event = []
        intersect_words = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')

        # print(url_splits)

        conference_name = url_splits[-4]
        keyword_or_topic = url_splits[-3]
        auther_name = url_splits[-2]
        conference_event_name_abbr = url_splits[-1]

        author_obj = Author.objects.filter(Q(author_name=auther_name))[0]

        if keyword_or_topic == 'topic':
            models_data_conference_event = confutils.get_topics_from_models(
                conference_event_name_abbr)

        elif keyword_or_topic == 'keyword':
            models_data_conference_event = confutils.get_keywords_from_models(
                conference_event_name_abbr)

        for data in models_data_conference_event:
            words_conferemce_event.append(data.get(keyword_or_topic))

        author_publications = confutils.get_author_publications_in_conf(
            author_obj.semantic_scolar_author_id, conference_name, "")

        print(author_publications, 'author_publications')
        author_interests = confutils.get_author_interests(
            author_publications, "", keyword_or_topic, 30)
        sorted_data_author_interests = dict(
            sorted(author_interests.items(), key=lambda item: item[1], reverse=True))

        for key, value in sorted_data_author_interests.items():
            words_author.append(key)

        reduced1 = words_conferemce_event[0:10]
        reduced2 = words_author[0:10]
        intersect_words = list(set(reduced1).intersection(reduced2))

        ctx = confutils.generate_venn_photo(words_author[0:10], words_conferemce_event[0:10],
                                            intersect_words[0:10], auther_name, conference_event_name_abbr, keyword_or_topic)

        return Response({
            "compare": ctx
        })


'''
View to obtain common keywords for conference venn diagram
'''


class VennOverviewKeys(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        # print("the url path is:", url_path)
        #url_path=url_path.replace("%20"," ")
        topics_split = url_path.split(r"/")
        print(topics_split)
        return Response({
            "commontopics":
            generateVennDataKeys(
                topics_split[-3], topics_split[-2], topics_split[-1])
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
        # print(topics_split)
        # print(getAllKeywords('2011'))
        return Response({"keywords": getAllKeywords('2011')})


'''
get all topics for author network
'''


class AllTopicsView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name_abbr = url_splits[-1]
        keyword_or_topic = url_splits[-2]

        models_data = []
        result_data_with_duplicates = []
        result_data = []

        if keyword_or_topic == 'topic':
            models_data = confutils.get_topics_from_models(
                conference_event_name_abbr)
        elif keyword_or_topic == 'keyword':
            models_data = confutils.get_keywords_from_models(
                conference_event_name_abbr)

        for model_data in models_data:
            result_data_with_duplicates.append(
                model_data.get(keyword_or_topic))

        # print(models_data)

        result_data = [{
            "value": val,
            "label": val
        } for val in list(set(result_data_with_duplicates))]

        return Response({"keywords": result_data})


'''
View to get keywords for the author network
'''


class SearchKeywordView(APIView):
    def get(self, request, *args, **kwargs):
        paper_authors = []
        authors_pairs_list = []
        all_pairs_dicts_list = []
        all_event_authors_list = []
        result_data = {}

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        print(url_splits)

        keyword_or_ropic = ""
        word = url_splits[-2]
        conference_event_name_abbr = url_splits[-1]
        session = settings.NEO4J_SESSION.session()
        models_data = confutils.get_abstract_based_on_keyword(
            conference_event_name_abbr, word)
        if not models_data:
            result_data = {
                "nodes": [{
                    "id": "No Data Found",
                    "size": 500,
                    "x": 500,
                    "y": 200
                }]
            }
            return Response(
                {"titles": result_data})
        else:
            for data in models_data:
                authors_ids = session.excute_read(
                    GetAuthorsOfPaper, data['paper_id'])
                # authors_ids = Author_has_Papers.objects.filter(
                #     paper_id_id=data['paper_id'])
                for author_id in authors_ids:
                    # author_obj = Author.objects.get(
                    #     semantic_scolar_author_id=author_id.author_id_id)
                    paper_authors.append(author_id.get('author_name'))

                if len(paper_authors) > 1:
                    authors_pairs_list = combinations(paper_authors, 2)
                    for author_name in paper_authors:
                        all_event_authors_list.append(author_name)
                else:
                    authors_pairs_list = []
                    paper_authors = []
                    continue

                for pair in authors_pairs_list:
                    all_pairs_dicts_list.append({
                        'source': pair[0],
                        'target': pair[1],
                    })
                authors_pairs_list = []
                paper_authors = []
            # print('############################ +++++++++++++++++++      ############### all_pairs_dicts_list ############################ ++++++++++++++++++ ##############')
            # print(all_pairs_dicts_list)
            # print('############################ +++++++++++++++++++      ############### all_pairs_dicts_list ############################ ++++++++++++++++++ ##############')

            # print('############################ +++++++++++++++++++      ############### all_event_authors_list ############################ ++++++++++++++++++ ##############')
            # print(all_event_authors_list)
            # print('############################ +++++++++++++++++++      ############### all_event_authors_list ############################ ++++++++++++++++++ ##############')

            nodes = []
            count = {}
            for author in all_event_authors_list:
                if not author in count:
                    count[author] = 70
                    nodes.append({
                        'id': author,
                        'size': 70
                    })
                else:
                    for node in nodes:
                        if node['id'] == author:
                            node['size'] += 70

            result_data = {"nodes": nodes, "links": all_pairs_dicts_list}

            # print('############################ +++++++++++++++++++      ############### result_data ############################ ++++++++++++++++++ ##############')
            # print(result_data)
            # print('############################ +++++++++++++++++++      ############### result_data ############################ ++++++++++++++++++ ##############')

            return Response(
                {"titles": result_data})


'''
View to get topics for the author network
'''


class SearchTopicView(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        # print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        # print(topics_split)
        return Response(
            {"titles": searchForTopics(topics_split[-1], topics_split[-2])})


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
        # print(topics_split)
        return Response({
            "authors":
            getAuthorFromAuthorName(topics_split[-3], topics_split[-2],
                                    '2011')
        })


class OverviewChartViewTopics(APIView):
    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        # print("the url path is:", url_path)
        url_path = url_path.replace("%20", " ")
        topics_split = url_path.split(r"/")
        # print(topics_split)
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

# BAB 08.06.2021 Extension for other conferences other than LAK
# modified


class FetchAbstractView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_name = url_splits[-3]
        word = url_splits[-2]
        conference_event_name_abbr = url_splits[-1]
        # sconfutils.get_abstract_based_on_keyword(conference_event_name_abbr,word)
        return Response(
            confutils.get_abstract_based_on_keyword(
                conference_event_name_abbr, word)
        )


'''
View to get topic details of Author
'''


class AuthorFetchYearView(APIView):
    def get(self, request, *args, **kwargs):
        print("##############AuthorFetchYearView")
        result_data = []
        models_data = []
        session = settings.NEO4J_SESSION.session()
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name = url_splits[-1]
        conference_name = url_splits[-2]

        # print(url_splits)
        if conference_event_name == "all years":
            # models_data = confutils.get_authors_data(conference_name, "")
            # models_data = session.execute_read(
            #     GetEventAuthors, conference_event_name)
            author_has_papers_objs = session.execute_read(
                GetConferenceAuthors, conference_name)
        else:
            # models_data = confutils.get_authors_data("", conference_event_name)
            author_has_papers_objs = session.execute_read(
                GetEventAuthors, conference_event_name)
        for author_obj in author_has_papers_objs:

            author_event_papers_objs = session.execute_read(
                GetAuthorPapers, author_obj.get('semantic_scolar_author_id'))
            result_data.append({
                'semantic_scholar_author_id': author_obj.get('semantic_scolar_author_id'),
                'name': author_obj.get('author_name'),
                'semantic_scholar_url': author_obj.get('author_url'),
                'no_of_papers': len(author_event_papers_objs),
                'conference_name': conference_name,
            })
        # for data in models_data:
        #     result_data.append({
        #         #     "value": data['name'],
        #         #     "label": data['name']
        #         "value": data.get('conference_event_name_abbr'),
        #         "label": data.get('conference_event_name_abbr')
        #     })
        session.close()
        result_data = sorted(
            result_data, key=lambda k: k['no_of_papers'], reverse=True)

        return Response({"authors": result_data})


'''
View to get topic details
'''


class AuthorTopicComparisonView(APIView):

    def get(self, request, *args, **kwargs):
        result_data = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        url_splits_and_symbol = url_splits_question_mark[1].split("&")
        url_splits_slash = url_splits_question_mark[0].split("/")
        print(url_splits_and_symbol)
        keyword_or_topic = url_splits_and_symbol[-1]
        conference_event_name_abbr = url_splits_and_symbol[-2]
        first_author_name = url_splits_and_symbol[-4]
        second_author_name = url_splits_and_symbol[-3]
        conference_name = url_splits_slash[-2]
        session = settings.NEO4J_SESSION.session()
        first_author_obj = session.execute_read(
            GetAuthorByName, first_author_name)
        second_author_obj = session.execute_read(
            GetAuthorByName, second_author_name)

        if (keyword_or_topic == 'keyword'):
            keywords = session.execute_read(
                GetAuthorKeyword, first_author_obj.get('semantic_scolar_author_id'))
            return keywords
        elif keyword_or_topic == 'topic':
            topics = session.execute_read(
                GetAuthorTopic, first_author_obj.get('semantic_scolar_author_id'))
        # first_author_publications = confutils.get_author_publications_in_conf(
        #     first_author_obj.get('semantic_scolar_author_id'), conference_name, conference_event_name_abbr)

        # second_author_publications = confutils.get_author_publications_in_conf(
        #     second_author_obj.get('semantic_scolar_author_id'), conference_name, conference_event_name_abbr)

        # first_author_interests = confutils.get_author_interests(
        #     first_author_publications, "", keyword_or_topic)
        # sorted_data_first_author = dict(
        #     sorted(first_author_interests.items(), key=lambda item: item[1], reverse=True))
        # reduced_sorted_data_first_author = dict(
        #     itertools.islice(sorted_data_first_author.items(), 10))

        # second_author_interests = confutils.get_author_interests(
        #     second_author_publications, "", keyword_or_topic)
        # sorted_data_second_author = dict(sorted(second_author_interests.items(
        # ), key=lambda item: item[1], reverse=True))  # itertools.islice(d.items(), 2)
        # reduced_sorted_data_second_author = dict(
        #     itertools.islice(sorted_data_second_author.items(), 10))

        # authors_dict = {
        #     k: [reduced_sorted_data_first_author.get(k, 0),
        #         reduced_sorted_data_second_author.get(k, 0)]
        #     for k in reduced_sorted_data_first_author.keys() | reduced_sorted_data_second_author.keys()
        # }

        # set_intersect_key = list(
        #     set(reduced_sorted_data_first_author.keys()).intersection(set(reduced_sorted_data_second_author.keys())))

        # words = authors_dict.keys()
        # weights = authors_dict.values()
        # authors_name = [first_author_name, second_author_name]
        # print(set_intersect_key, '-----------', words, '+++++++++',
        #       weights, '++++++++', authors_name, '------------')

        # result_data.append(words)
        # result_data.append(weights)
        # result_data.append(authors_name)
        # result_data.append(set_intersect_key)

        # print('######################## HERE #########################')
        # print(authors_dict)
        # print('######################## HERE #########################')

        # print(dict(itertools.islice(sorted_data_first_author.items(), 10)))
        # print('############')
        # print(dict(itertools.islice(sorted_data_second_author.items(), 10)))

        return Response({
            "authortopics": result_data})

        # return Response({"authortopics":getDataAuthorComparisonTopics(topics_split_params[-1],topics_split_params[-3],topics_split_params[-2])})


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


if __name__ == "__main__":
    conferenceDeleteView()
