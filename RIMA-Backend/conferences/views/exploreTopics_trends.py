import itertools
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .. import conference_utils as confutils
from conferences.models.graph_db_entities import *
from neomodel import *
from interests.Keyword_Extractor.extractor import getKeyword
from conferences.conference_utils_cql import cql_get_conference_events
import urllib.parse
from itertools import combinations
from conferences.utils import explore_topics_trends_utils as expoTopicsUtils
from conferences.utils import compare_conferences_utils as compConfUtils


class SharedTopicsBetweenEvents(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-2]
        events = confutils.split_restapi_url(
            url_splits, r'&')

        Keyword_topics = "keyword"
        final_sets = []
        topicsKeywords_name = []

        filtered_events = [event for event in events if event != ""]
        print("events: ", events)
        if len(events) == 0:
            return Response({
                "sets": final_sets,
                "names": topicsKeywords_name
            })

        events_keywords = expoTopicsUtils.get_events_TopicsOrKeywords(
            Keyword_topics, filtered_events)

        all_combs = []
        event_names = [item for item in filtered_events]
        for r in range(1, len(event_names) + 1):
            all_combs.extend(combinations(event_names, r))

        results = expoTopicsUtils.get_shared_keywordsOrTopics_basedOn_combs(
            events_keywords, all_combs)

        return Response({
            "sets": results[0],
            "names": results[1]
        })


# new class by Islam
class TopicPopularityAcrossYears(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        events_list = confutils.split_restapi_url(
            url_splits_question_mark[-4], r'&')
        number_of_keyphrase = url_splits_question_mark[-3]
        Keyword_or_topics = "keyword"
        shared_keyphrase = url_splits_question_mark[-2]

        number_of_keyphrase = int(number_of_keyphrase)
        data = expoTopicsUtils.get_publication_count_for_Multi_events(
            events_list, Keyword_or_topics, number_of_keyphrase, shared_keyphrase)

        sets = expoTopicsUtils.convert_data_to_barChart_sets(data)
        print("sets", sets)

        return Response({
            "data": sets,
            "years": events_list
        })

# new class by Islam


class TopicPopularityInConf(APIView):
    def get(self, request, *args, **kwargs):
        print("TopicPopularityInConf calledcalledcalledcalledcalledcalledcalled")
        conf_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-2]
        print("conf_name", conf_name)
        keyword_or_topic = "keyword"
        data = []
        number_of_keyphrase = "all"
        number_of_top_keyphrase = 10
        data = expoTopicsUtils.get_Top_Keyphrase_In_Conf(
            conf_name, keyword_or_topic, number_of_keyphrase, number_of_top_keyphrase)

        names = [item[0] for item in data]
        values = [round(item[1]) for item in data]

        print("TopicPopularityInConf:", data)
        return Response({
            "names": names,
            "values": {"data": values}
        })


# new class created by Islam


class RelevantPubsCountOfConf(APIView):
    def get(self, request, *args, **kwargs):
        print("getPublicationsConfCount called")
        conf_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-2]
        print("conf_name", conf_name)
        keyword_or_topic = "keyword"
        data = []
        number_of_keyphrase = "all"
        number_of_top_keyphrase = 5
        data = expoTopicsUtils.get_relavant_pubsCount__keywordTopic_conf_based(
            conf_name, keyword_or_topic, number_of_keyphrase, number_of_top_keyphrase)

        sets = expoTopicsUtils.convert_data_to_barChart_sets(data)
        all_years = compConfUtils.Conf_All_years(conf_name)
       # print("sets", sets)
        return Response({
            "data": sets,
            "years": all_years
        })
