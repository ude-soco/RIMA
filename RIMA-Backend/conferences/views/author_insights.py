from django.http.response import HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from conferences.models.graph_db_entities import *
from conferences.utils.author_insights_utils import *
from conferences import conference_utils as confutils
from rest_framework.response import Response
from itertools import chain


def author_insights_url():
    return HttpResponse("Author Insights.")


class getNetworkData(APIView):
    def get(self, request, *args, **kwargs):
        print("getNetworkData called")

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        Events = url_splits_slash[-1].split('&')

        graphData = []
        for event in Events:
            eventgraphData = get_event_coauthor_data(event)
            graphData.append(eventgraphData)

        allGraphData = list(chain(*graphData))
        return Response({
            "data": allGraphData
        })
