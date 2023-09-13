# created by Islam Abdelghaffar
import itertools
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .. import conference_utils as confutils
from conferences.models.graph_db_entities import *
from neomodel import *
from interests.Keyword_Extractor.extractor import getKeyword
from conferences.conference_utils_cql import cql_get_conference_events
from itertools import combinations
from conferences.utils import explore_topics_trends_utils as expoTopicsUtils
from conferences.utils import compare_conferences_utils as compConfUtils


# The `GetSharedTopicsAcrossEvents` class is an API view that retrieves shared topics across multiple events.
class GetSharedTopicsAcrossEvents(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-3]
        events = confutils.split_restapi_url(
            url_splits, r'&')

        Keyword_topics = "keyword"
        final_sets = []
        topicsKeywords_name = []

        filtered_events = [event for event in events if event != ""]
        if len(events) == 0:
            return Response({
                "sets": final_sets,
                "names": topicsKeywords_name
            })

        events_keywords = expoTopicsUtils.get_events_topics_or_keywords(
            Keyword_topics, filtered_events)

        all_combs = []
        event_names = [item for item in filtered_events]
        for r in range(1, len(event_names) + 1):
            all_combs.extend(combinations(event_names, r))

        results = expoTopicsUtils.get_shared_keywords_or_topics_based_on_combs(
            events_keywords, all_combs)

        return Response({
            "sets": results[0],
            "names": results[1]
        })


# The `GetSharedPopularTopicsAcrossYears` class is an API view that retrieves shared popular topics across multiple years based on specified events, number of keyphrases, and a shared keyphrase.
class GetSharedPopularTopicsAcrossYears(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        events_list = confutils.split_restapi_url(
            url_splits_question_mark[-6], r'&')
        number_of_keyphrase = url_splits_question_mark[-4]
        Keyword_or_topics = "keyword"
        shared_keyphrase = url_splits_question_mark[-2]

        number_of_keyphrase = int(number_of_keyphrase)
        data = expoTopicsUtils.get_publication_count_for_multi_events(
            events_list, Keyword_or_topics, number_of_keyphrase, shared_keyphrase)

        sets = expoTopicsUtils.convert_data_to_barChart_sets(data)

        return Response({
            "data": sets,
            "years": events_list
        })



# The `GetTopPopularTopicsInConf` class is an API view that retrieves the top popular topics in a conference and returns the names and values of these topics.
class GetTopPopularTopicsInConf(APIView):
    def get(self, request, *args, **kwargs):
        conf_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-4]
        keyword_or_topic = "keyword"
        data = []
        number_of_keyphrase = "all"
        number_of_top_keyphrase = 10
        data = expoTopicsUtils.get_Top_Keyphrase_In_conf(
            conf_name, keyword_or_topic, number_of_keyphrase, number_of_top_keyphrase)

        names = [item[0] for item in data]
        values = [round(item[1]) for item in data]

        return Response({
            "names": names,
            "values": {"data": values}
        })




# The class `GetEvolutionTopPopularTopicsInConf` is an API view that retrieves the evolution of the top popular topics in a conference based on keywords or topics.
class GetEvolutionTopPopularTopicsInConf(APIView):
    def get(self, request, *args, **kwargs):
        conf_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-4]
        keyword_or_topic = "keyword"
        data = []
        number_of_keyphrase = "all"
        number_of_top_keyphrase = 5
        data = expoTopicsUtils.get_relavant_pubs_Count__keyword_topic_conf_based(
            conf_name, keyword_or_topic, number_of_keyphrase, number_of_top_keyphrase)

        sets = expoTopicsUtils.convert_data_to_barChart_sets(data)
        all_years = compConfUtils.conf_all_years(conf_name)
        return Response({
            "data": sets,
            "years": all_years
        })
