from itertools import combinations
from rest_framework.views import APIView
from conferences import conference_utils as confutils  # type: ignore
from conferences.utils import compare_authors_utils as compareAuthorsUtils
from rest_framework.response import Response


class compareAuthorsBasedPublicationCount(APIView):
    def get(self, request, *args, **kwargs):
        print("compareAuthorsBasedPublicationCount called")
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_list = url_splits_slash[-2].split("&")
        conf = url_splits_slash[-1].split("&")
        authors_data = []
        print("url_splits_slash", url_splits_slash)
        print("authors: ", author_list)
        print("conf: ", conf)
        if "All Conferences" in conf:
            authors_data = compareAuthorsUtils.get_authors_publications_count_AllConf(
                author_list)
        else:
            authors_data = compareAuthorsUtils.get_authors_publications_count_Conf_based(
                author_list, conf)
        return Response(authors_data)


class compareAuthorsBasedCitationCountAllConf(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-3].split("&")
        confs_list = url_splits_slash[-2].split("&")
        print("confs: ", confs_list)
        authors_data = compareAuthorsUtils.get_authors_citations(
            confs_list, author_list)

        return Response(authors_data)


class coauthor_evolution_over_time(APIView):
    def get(self, request, *args, **kwargs):
        print("coauthor_evolution_over_time called")
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-1].split("&")
        print("author list from fuc: ", author_list)
        authors_data = compareAuthorsUtils.get_co_author_evolutions(
            author_list)

        print("author data: ", authors_data)

        return Response(authors_data)


class sharedInterestsBetweenAuthor(APIView):
    def get(self, request, *args, **kwargs):
        print("sharedInterestsBetweenAuthor called")
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-3].split("&")
        confs = url_splits_slash[-2].split("&")
        final_sets = []
        pub_titles = []
        if len(author_list) == 0:
            return Response({
                "sets": final_sets,
                "names": pub_titles
            })
        sharedInterests = compareAuthorsUtils.getSharedInterestsBetweenAuthors(
            confs, author_list)
        all_combs = []
        authors_name = [author["name"] for author in sharedInterests]
        for r in range(1, len(authors_name) + 1):
            all_combs.extend(combinations(authors_name, r))

        results = compareAuthorsUtils.get_shared_keyword_basdOn_combs(
            sharedInterests, all_combs
        )

        return Response({
            "sets": results[0],
            "names": results[1]
        })


class sharedPublicationBetweenAuthors(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        author_list = url_splits_slash[-3].split("&")
        confs = url_splits_slash[-2].split("&")
        final_sets = []
        pub_titles = []
        if len(author_list) == 0:
            return Response({
                "sets": final_sets,
                "names": pub_titles
            })
        authors_publications = compareAuthorsUtils.getSharedPublicationBetweenAuthors(
            confs, author_list)

        all_combs = []
        authors_name = [author["name"] for author in authors_publications]
        for r in range(1, len(authors_name) + 1):
            all_combs.extend(combinations(authors_name, r))
        print("authors_publications: ", all_combs)

        results = compareAuthorsUtils.get_shared_pubs_basdOn_combs(
            authors_publications, all_combs
        )

        return Response({
            "sets": results[0],
            "names": results[1]
        })


class AuthorProductivityEvolution(APIView):
    def get(self, request, *args, **kwargs):
        print("coauthor_evolution_over_time called")
        url_splits_slash = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        author_list = url_splits_slash[-3].split("&")
        confs = url_splits_slash[-2].split("&")
        authors_data = compareAuthorsUtils.get_authors_pubs_evolutions(
            confs, author_list)

        print("author data: ", authors_data)

        return Response(authors_data)
