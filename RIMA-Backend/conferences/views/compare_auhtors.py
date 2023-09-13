from itertools import combinations
from rest_framework.views import APIView
from conferences import conference_utils as confutils  # type: ignore
from conferences.utils import compare_authors_utils as compareAuthorsUtils
from rest_framework.response import Response


class GetCompareAuthorsBasedPublicationCount(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_list = url_splits_slash[-5].split("&")
        conf = url_splits_slash[-3].split("&")
        authors_data = []
        if "All Conferences" in conf:
            authors_data = compareAuthorsUtils.get_authors_publications_count_all_confs(
                author_list)
        else:
            authors_data = compareAuthorsUtils.get_authors_publications_count_conf_based(
                author_list, conf)
        return Response(authors_data)


class GetCompareAuthorsBasedCitationCountAllConf(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-5].split("&")
        confs_list = url_splits_slash[-3].split("&")
        authors_data = compareAuthorsUtils.get_authors_citations(
            confs_list, author_list)

        return Response(authors_data)


class GetCoauthorEvolutionOverTime(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-3].split("&")
        authors_data = compareAuthorsUtils.get_coauthor_evolutions(
            author_list)

        return Response(authors_data)


class GetSharedInterestsBetweenAuthor(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-5].split("&")
        confs = url_splits_slash[-3].split("&")
        final_sets = []
        pub_titles = []
        if len(author_list) == 0:
            return Response({
                "sets": final_sets,
                "names": pub_titles
            })
        sharedInterests = compareAuthorsUtils.get_shared_interests_between_authors(
            confs, author_list)
        all_combs = []
        authors_name = [author["name"] for author in sharedInterests]
        for r in range(1, len(authors_name) + 1):
            all_combs.extend(combinations(authors_name, r))

        results = compareAuthorsUtils.get_shared_keyword_basd_on_combs(
            sharedInterests, all_combs
        )

        return Response({
            "sets": results[0],
            "names": results[1]
        })


class GetSharedPublicationBetweenAuthors(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-5].split("&")
        confs = url_splits_slash[-3].split("&")
        final_sets = []
        pub_titles = []
        if len(author_list) == 0:
            return Response({
                "sets": final_sets,
                "names": pub_titles
            })
        authors_publications = compareAuthorsUtils.get_shared_publication_between_authors(
            confs, author_list)

        all_combs = []
        authors_name = [author["name"] for author in authors_publications]
        for r in range(1, len(authors_name) + 1):
            all_combs.extend(combinations(authors_name, r))

        results = compareAuthorsUtils.get_shared_pubs_basd_on_combs(
            authors_publications, all_combs
        )

        return Response({
            "sets": results[0],
            "names": results[1]
        })


class GetAuthorProductivityEvolution(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_list = url_splits_slash[-5].split("&")
        confs = url_splits_slash[-3].split("&")
        authors_data = compareAuthorsUtils.get_authors_pubs_evolutions(
            confs, author_list)

        return Response(authors_data)
