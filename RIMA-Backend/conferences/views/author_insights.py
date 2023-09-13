# created by Islam Abdelghaffar
from django.http.response import HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from conferences.models.graph_db_entities import *
from conferences.utils import author_insights_utils as authorInsightsUtil
from conferences import conference_utils as confutils
from rest_framework.response import Response
from itertools import chain


# The `GetAuthorDetails` class is an API view that retrieves detailed information about an author based on their ID.
class GetAuthorDetails(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-3]
        author_data = authorInsightsUtil.get_author_detailed_info(author_id)

        return Response({
            "data": author_data
        })


# The `GetAuthorPublicationsOverYears` class is an API view that retrieves and returns the publication data of an author over the years.
class GetAuthorPublicationsOverYears(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-3]
        author_data = authorInsightsUtil.get_author_pubs_over_years(author_id)

        return Response(author_data)


# The `GetAuthorPublicationCountBasedConfs` class is an API view that retrieves publication counts for a specific author based on selected conferences.
class GetAuthorPublicationCountBasedConfs(APIView):
    def get(self, request, *args, **kwargs):

        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_id = url_splits_slash[-5]
        selectedConfs = (url_splits_slash[-2]).split("&")

        author_data = authorInsightsUtil.filter_publication_based_on_confs(
            author_id, selectedConfs)

        return Response(author_data)


# The GetAllAuthorPublicationList class is an API view that retrieves a list of publications for a given author and returns the list in a specific format.
class GetAllAuthorPublicationList(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_name = url_splits_slash[-2]
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

        return Response({
            "publicationList": final_pubs_list
        })


# The `GetNetworkDataAuthor` class is an API view that retrieves network data and conference information for a specific author.
class GetNetworkDataAuthor(APIView):
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


# The `GetAuthorPublicatinInYear` class is an API view that retrieves a list of publications by a specific author in a given year.
class GetAuthorPublicatinInYear(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-2]
        pub_year = url_splits_slash[-1]
        final_pubs_list = []
        publication_List = authorInsightsUtil.get_author_pubs_In_year(
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

        return Response({
            "publicationList": final_pubs_list
        })


# The `GetWordPublicationByYearAndAuthor` class is an API view that retrieves a list of publications based on a given author, keyword, and publication year.
class GetWordPublicationByYearAndAuthor(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-7]
        word = url_splits_slash[-5]
        pub_year = url_splits_slash[-3]

        final_pubs_list = []
        publication_List = authorInsightsUtil.get_author_pubs_by_keyword_In_year(
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

        return Response({
            "publicationList": final_pubs_list
        })


# The class `GetPublicationListBasedOnEventName` is an API view that retrieves a list of publications based on an event name.
class GetPublicationListBasedOnEventName(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-5]
        events = url_splits_slash[-3]
        final_pubs_list = []
        publication_List = authorInsightsUtil.get_author_publications(
            author_id)
        filteredlist = authorInsightsUtil.filter_publication_based_on_events(
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

        return Response({
            "publicationList": final_pubs_list
        })


# The `GetAllAvailableAuthors` class is an API view that retrieves all available authors from a list of conferences.
class GetAllAvailableAuthors(APIView):
    def get(self, request, *args, **kwargs):
        confs = Conference.nodes.all()
        confs = [conf.conference_name_abbr for conf in confs]
        authors = authorInsightsUtil.get_all_authors(confs)
        return Response(authors)


# The GetAllAvailabeAuthorsFilterBased class is an API view that retrieves a list of authors based on certain filters and returns the ordered list of authors.
class GetAllAvailabeAuthorsFilterBased(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        selectedConf = url_splits_slash[-2].split("&")
        mostPublished = url_splits_slash[-4]
        orderedAuthors = []
        if mostPublished == "true":
            orderedAuthors = authorInsightsUtil.get_most_published_authors(
                selectedConf)

        else:

            orderedAuthors = authorInsightsUtil.get_all_authors(selectedConf)

        return Response(orderedAuthors)


# The class `GetAllAvailableConfs` is an API view that retrieves and returns a list of available conferences.
class GetAllAvailabelConfs(APIView):
    def get(self, request, *args, **kwargs):
        conferences = authorInsightsUtil.get_available_confs()
        return Response(conferences)


# The `GetAllAvailableEvents` class is an API view that retrieves all available events and conferences and returns them as a response.
class GetAllAvailabelEvents(APIView):
    def get(self, request, *args, **kwargs):

        events = authorInsightsUtil.get_available_events()
        confs = authorInsightsUtil.get_available_confs()

        events = [{"name": event.conference_event_name_abbr,
                   "label": event.conference_event_name_abbr} for event in events]

        confs.extend(events)

        return Response(confs)


# The `GetAuthorPublicationsCitations` class is an API view that retrieves the publications and citations of an author over time based on selected conferences.
class GetAuthorPublicationsCitations(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-6]
        selectedConfs = url_splits_slash[-2].split("&")

        data = authorInsightsUtil.get_author_pubs_citations_over_time(
            selectedConfs, author_id)

        return Response(data)


# The `GetAuthorPublications` class is an API view that retrieves a specific author's publications and conferences and returns them in a sorted format.
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

        data = {
            "pubs": sort_pubs,
            "Confs": authorConfs
        }
        return Response(data)


# The `GetPublicationKeywords` class is an API view that retrieves the keywords associated with a publication based on its ID.
class GetPublicationKeywords(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        publication_id = url_splits_slash[-3]

        keywords = authorInsightsUtil.get_publication_keywords(publication_id)

        return Response(keywords)


# The `GetPublicationByID` class is an API view that retrieves publication information based on a given publication ID.
class GetPublicationByID(APIView):
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

        return Response({
            "publicationList": final_pubs_list
        })


# The `GetPublicationByTitle` class is an API view that retrieves a publication by its title and returns a list of relevant information about the publication.
class GetPublicationByTitle(APIView):
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

        return Response({
            "publicationList": final_pubs_list
        })


# The `GetPublicationByKeywordOfAuthor` class is an API view that retrieves a list of publications based on a selected keyword and a list of authors.
class GetPublicationByKeywordOfAuthor(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        selectedKeyword = url_splits_slash[-2]
        authors = url_splits_slash[-4].split("&")
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

        return Response({
            "publicationList": final_pubs_list
        })


# The `GetAuthorInterestes` class is an API view that retrieves the interests and conferences of an author based on their ID.
class GetAuthorInterestes(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_id = url_splits_slash[-3]

        interests = authorInsightsUtil.get_author_interests(author_id)
        confs = authorInsightsUtil.get_author_Conferences(author_id)
        data = {
            "interests": interests,
            "confs": confs
        }
        return Response(data)
