from django.http.response import HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from conferences.models.graph_db_entities import *
from conferences.utils.author_insights_utils import *
from conferences import conference_utils as confutils


def author_insights_url():
    return HttpResponse("Author Insights.")


class getNetworkData(APIView):
    def get(self, request, *args, **kwargs):
        print("getNetworkData called")

        # url_splits_question_mark = confutils.split_restapi_url(request.get_full_path(), r'?')
        # url_splits_slash = confutils.split_restapi_url(request.get_full_path(), r'/')
        # word = url_splits_slash[-2]
        # conference_events= confutils.split_restapi_url(url_splits_question_mark[1],r'&')

        # for event in conference_events:
        get_publication_detailed_info(
            "33b94cd960a8ac384579ed45c3e15d236bc170f6")
