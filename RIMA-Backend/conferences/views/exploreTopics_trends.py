

import itertools
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from conferences.utils import compare_conferences_utils as compConfUtils
from .. import conference_utils as confutils
from conferences.models.graph_db_entities import *
from neomodel import *
from interests.Keyword_Extractor.extractor import getKeyword
from conferences.conference_utils_cql import cql_get_conference_events
import urllib.parse
from itertools import combinations
from conferences.utils import explore_topics_trends_utils as expoTopicsUtils


class SharedTopicsBetweenEvents(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-2]
        events = confutils.split_restapi_url(
            url_splits, r'&')
        print("first event:", events[0])
        print("second event:", events[1])
        print("third event:", events[2])
        final_sets = []
        topicsKeywords_name = []
        if len(events) == 0:
            return Response({
                "sets": final_sets,
                "names": topicsKeywords_name
            })
        Keyword_topics = "keyword"
        # events_topics = expoTopicsUtils.get_events_topics_keywords(
        #     Keyword_topics, events)
       # events_authors = compConfUtils.get_events_authors(filtered_events)
