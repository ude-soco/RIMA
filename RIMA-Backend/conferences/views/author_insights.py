from django.http.response import HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from conferences.models.graph_db_entities import *
from conferences.utils import author_insights_utils as authorInsightsUtil
from conferences import conference_utils as confutils
from rest_framework.response import Response
from itertools import chain


class getAuthorDetails(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-1]
        author_data = authorInsightsUtil.get_author_detailed_info(author_id)

        print("author_data11: ", author_data)
        return Response({
            "data": author_data
        })


class getAuthorPublicationsOverYears(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-1]
        author_data = authorInsightsUtil.get_author_pubs_overYears(author_id)
        print("author_data: ", author_data)

        return Response(author_data)


class getAuthorPublicationCountBasedConfs(APIView):
    def get(self, request, *args, **kwargs):

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        print("url_splits_slash", url_splits_slash)
        author_id = url_splits_slash[-3]
        selectedConfs = (url_splits_slash[-2]).split("&")

        print("author_name: ", author_id)
        print("selectedConfs: ", selectedConfs)

        author_data = authorInsightsUtil.filter_publication_basedOn_confs(
            author_id, selectedConfs)

        return Response(author_data)


class getAllAuthorPublicationList(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_name = url_splits_slash[-2]
        print("author_name ::", author_name)
        publication_List = authorInsightsUtil.get_author_publications(
            author_name)

        final_pubs_list = []
        if publication_List is not None:
            final_pubs_list = [{
                "paper_id": pub.paper_id,
                "title": pub.title,
                "authors": ', '.join([author.author_name for author in pub.authors]),
                "abstract": pub.abstract,
                "year": pub.years,
                "url": pub.urls
            }for pub in publication_List]

        print("publicationList,::::::", (final_pubs_list))

        return Response({
            "publicationList": final_pubs_list
        })


class getNetworkDataAuthor(APIView):
    def get(self, request, *args, **kwargs):

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-1]

        graphData = authorInsightsUtil.get_author_network(author_id)

        return Response({
            "data": graphData
        })


class getAuthorPublicatinInYear(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_name = url_splits_slash[-2]
        pub_year = url_splits_slash[-1]
        final_pubs_list = []
        publication_List = authorInsightsUtil.get_Author_Pubs_InYear(
            author_name, pub_year)

        if publication_List is not None:
            final_pubs_list = [{
                "paper_id": pub.paper_id,
                "title": pub.title,
                "authors": ', '.join([author.author_name for author in pub.authors]),
                "abstract": pub.abstract,
                "year": pub.years,
                "url": pub.urls,
                "event":pub.published_in[0].conference_event_name_abbr,
            }for pub in publication_List]

        print("publicationList", (final_pubs_list))

        return Response({
            "publicationList": final_pubs_list
        })


class getPublicationListBasedOnEventName(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-2]
        events = url_splits_slash[-1]
        final_pubs_list = []
        print("pub_year: ", events.split("&"))
        publication_List = authorInsightsUtil.get_author_publications(
            author_id)
        filteredlist = authorInsightsUtil.filter_publication_basedOn_Events(
            publication_List, events)
        if filteredlist is not None:
            final_pubs_list = [{
                "paper_id": pub.paper_id,
                "title": pub.title,
                "authors": ', '.join([author.author_name for author in pub.authors]),
                "abstract": pub.abstract,
                "year": pub.years,
                "url": pub.urls,
                "event":pub.published_in[0].conference_event_name_abbr,
            }for pub in filteredlist]

        print("publicationList", (final_pubs_list))

        return Response({
            "publicationList": final_pubs_list
        })


class getNetworkDataSpecificEvents(APIView):
    def get(self, request, *args, **kwargs):
        print("getNetworkData called")

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        Events = url_splits_slash[-1].split('&')

        graphData = []
        for event in Events:
            eventgraphData = authorInsightsUtil.get_event_coauthor_data(event)
            graphData.append(eventgraphData)

        allGraphData = list(chain(*graphData))
        return Response({
            "data": allGraphData
        })


class getNetworkDataAllConfs(APIView):
    def get(self, request, *args, **kwargs):
        print("getNetworkData called")

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        events = authorInsightsUtil.get_available_events()
        graphData = []
        for event in events:
            eventgraphData = authorInsightsUtil.get_event_coauthor_data(event)
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
            eventAuthorList = authorInsightsUtil.get_event_author_set_VennDiagram(
                event)
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
                'label': set['label'].difference(intersection) if len(set['sets']) == 1 else set['label']
            })

        print("vennData: ", vennDataUpdated)
        return Response({
            'data': vennDataUpdated})


class getAllAvailableAuthors(APIView):
    def get(self, request, *args, **kwargs):
        authors = authorInsightsUtil.getAllAuthors()
        return Response(authors)
