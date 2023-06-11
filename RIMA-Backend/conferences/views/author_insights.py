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


class getVennDiagramDate(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        Events = url_splits_slash[-1].split('&')

        vennData = []
        for event in Events:
            eventAuthorList = get_event_author_set_VennDiagram(event)
            vennData.append({
                'sets': [event],
                'label': eventAuthorList,
            })

        if (len(vennData) == 1):
            return Response({
                'data': vennData})

        intersection = vennData[0]['label']
        for set in vennData[1:]:
            intersection = intersection.intersection(set['label'])

        vennData.append({
            'sets': ([f"{event}" for event in Events]),
            'label': '' if len(intersection) == 0 else intersection
        })

        vennDataUpdated = []
        for set in vennData:
            vennDataUpdated.append({
                'sets': set['sets'],
                'label': set['label'].difference(intersection) if len(set['sets'])==1 else set['label']
            })

        print("vennData: ", vennDataUpdated)
        return Response({
            'data': vennDataUpdated})
