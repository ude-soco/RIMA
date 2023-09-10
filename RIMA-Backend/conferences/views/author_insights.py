from django.http.response import HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from conferences.models.graph_db_entities import *
from conferences.utils import author_insights_utils as authorInsightsUtil
from conferences import conference_utils as confutils
from rest_framework.response import Response
from itertools import chain


class GetAuthorDetails(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-3]
        print("********************************************************************")
        print("url_splits_slash:", url_splits_slash)
        print("********************************************************************")
        author_data = authorInsightsUtil.get_author_detailed_info(author_id)

        print("author_data11: ", author_data)
        return Response({
            "data": author_data
        })


class GetAuthorPublicationsOverYears(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-3]
        author_data = authorInsightsUtil.get_author_pubs_overYears(author_id)
        print("author_data: ", author_data)

        return Response(author_data)


class GetAuthorPublicationCountBasedConfs(APIView):
    def get(self, request, *args, **kwargs):

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        print("url_splits_slash", url_splits_slash)
        author_id = url_splits_slash[-5]
        selectedConfs = (url_splits_slash[-2]).split("&")

        print("author_name: ", author_id)
        print("selectedConfs: ", selectedConfs)

        author_data = authorInsightsUtil.filter_publication_basedOn_confs(
            author_id, selectedConfs)

        return Response(author_data)


class GetAllAuthorPublicationList(APIView):
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
        author_id = url_splits_slash[-3]

        graphData = authorInsightsUtil.get_author_network(author_id)
        confs = authorInsightsUtil.get_author_Conferences(author_id)
        return Response({
            "data": graphData,
            "confs": confs
        })


class getAuthorPublicatinInYear(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-2]
        pub_year = url_splits_slash[-1]
        final_pubs_list = []
        publication_List = authorInsightsUtil.get_Author_Pubs_InYear(
            author_id, pub_year)

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


class GetWordPublicationByYearAndAuthor(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-7]
        word = url_splits_slash[-5]
        pub_year = url_splits_slash[-3]
        print("author_name:", author_id)
        print("word: ", word)
        print("pub_year: ", pub_year)

        final_pubs_list = []
        publication_List = authorInsightsUtil.get_Author_Pubs_By_keyword_InYear(
            author_id, word, pub_year)

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


class GetPublicationListBasedOnEventName(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-5]
        events = url_splits_slash[-3]
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
        confs = Conference.nodes.all()
        confs = [conf.conference_name_abbr for conf in confs]
        authors = authorInsightsUtil.getAllAuthors(confs)
        return Response(authors)


class GetAllAvailabeAuthorsFilterBased(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        print("url_splits_slash: ", url_splits_slash)
        selectedConf = url_splits_slash[-2].split("&")
        mostPublished = url_splits_slash[-4]
        print("selectedConf: ", selectedConf)
        print("mostPublished: ", mostPublished)
        orderedAuthors = []
        if mostPublished == "true":
            orderedAuthors = authorInsightsUtil.get_Most_Published_authors(
                selectedConf)

        else:

            orderedAuthors = authorInsightsUtil.getAllAuthors(selectedConf)

        return Response(orderedAuthors)


class getAllAvailabelConfs(APIView):
    def get(self, request, *args, **kwargs):
        conferences = authorInsightsUtil.get_available_confs()
        return Response(conferences)


class getAllAvailabelEvents(APIView):
    def get(self, request, *args, **kwargs):

        events = authorInsightsUtil.get_available_events()
        confs = authorInsightsUtil.get_available_confs()

        events = [{"name": event.conference_event_name_abbr,
                   "label": event.conference_event_name_abbr} for event in events]

        confs.extend(events)

        return Response(confs)


class GetAuthorPublicationsCitations(APIView):
    def get(self, request, *args, **kwargs):
        print("getAuthorPublicationsCitations called")
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-6]
        selectedConfs = url_splits_slash[-2].split("&")

        print("seelected: ", selectedConfs)

        data = authorInsightsUtil.get_Author_Pubs_Citations_OverTime(
            selectedConfs, author_id)

        print("data: ", data)
        return Response(data)


class getAuthorPublicationsCitationsAnalysis(APIView):
    def get(self, request, *args, **kwargs):
        print("getAuthorPublicationsCitations called")
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        autorName = url_splits_slash[-2]
       # selectedConfs = url_splits_slash[-2].split("&")

        data = authorInsightsUtil.get_Author_Pubs_Citations_Analysis(autorName)

        print("Citation Analysis: ", data)
        return Response(data)


class GetAuthorPublications(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        authorId = url_splits_slash[-3]

        authorPublications = authorInsightsUtil.get_author_publications(
            authorId)

        sort_pubs = authorInsightsUtil.sort_publication_citation_based(
            authorPublications)

        authorConfs = authorInsightsUtil.get_author_Conferences(authorId)

        print("author conferences ", authorConfs)
        data = {
            "pubs": sort_pubs,
            "Confs": authorConfs
        }
        return Response(data)


class getPublicationKeywords(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        publication_id = url_splits_slash[-3]

        keywords = authorInsightsUtil.get_publication_keywords(publication_id)

        return Response(keywords)


class getPublicationByID(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        publication_id = url_splits_slash[-2]
        final_pubs_list = []

        publication_List = Publication.nodes.filter(
            paper_id=publication_id.strip())

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


class getPublicationByTitle(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        publication_Title = url_splits_slash[-2]
        final_pubs_list = []

        publication_List = Publication.nodes.filter(
            title=publication_Title.strip())

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


class GetPublicationByKeywordOfAuthor(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        selectedKeyword = url_splits_slash[-2]
        authors = url_splits_slash[-4].split("&")
        print("authors: ", authors)
        print("selectedKeyword: ", selectedKeyword)
        final_pubs_list = []

        publication_List = authorInsightsUtil.get_author_publications_keyword_based(
            selectedKeyword, authors)
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


class GetAuthorInterestes(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-3]

        print("author_id", author_id)
        interests = authorInsightsUtil.get_author_interests(author_id)
        confs = authorInsightsUtil.get_author_Conferences(author_id)
        data = {
            "interests": interests,
            "confs": confs
        }
        return Response(data)
