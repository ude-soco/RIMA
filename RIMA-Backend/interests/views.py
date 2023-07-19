import datetime
import monthdelta
from collections import OrderedDict
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    DestroyAPIView,
    ListAPIView,
)
from urllib.parse import unquote
from rest_framework.response import Response
from rest_framework.decorators import api_view
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikifilter, wikicategory
from interests.update_interests import normalize

from .serializers import (
    PaperSerializer,
    ListDataSerializer,
    BlacklistedKeywordSerializer,
    ShortTermInterestSerializer,
    LongTermInterestSerializer,
    InterestExtractionSerializer,
    KeywordSimilariySerializer,
    WikiCategoriesSerializer,
    TweetSerializer,
)
from .models import (
    Keyword,
    BlacklistedKeyword,
    ShortTermInterest,
    Paper,
    Tweet,
    LongTermInterest,
)
from accounts.models import User
from .twitter_utils import get_recommended_tweets
from .utils import (
    get_interest_similarity_score,
    get_top_long_term_interest_by_weight,
    get_top_short_term_interest_by_weight,
)
from interests.tasks import (
    import_user_data,
    import_user_paperdata,
    regenerate_interest_profile,
    remove_papers_for_user,
    import_user_papers,
)

# New imports
from .publication.publication_utils import get_recommended_publications_updated

from .publication_utils import (
    get_interest_paper_similarity,
    get_keywords_similarities,
)
from .my_interests import getDataNewInterestExplore

from .view.discover import getDataDiscover
from .view.explore import getDataExplore
from .view.connect import getConnectData
from .view.connect import getWikiInfo


class TriggerPaperUpdate(APIView):
    def post(self, request, *args, **kwargs):
        import_user_paperdata.delay(request.user.id)
        return Response({})


class ResetData(APIView):
    def post(self, request, *args, **kwargs):
        all_user_papers = request.user.papers.all()
        remove_papers_for_user(request.user.id, all_user_papers)
        request.user.blacklisted_papers.all().delete()  # clean the blacklisted papers list for that user
        LongTermInterest.objects.filter(user_id=request.user.id).delete()
        ShortTermInterest.objects.filter(user_id=request.user.id).delete()
        Tweet.objects.filter(user_id=request.user.id).delete()
        import_user_data(request.user.id)
        return Response({})


class EditPaper(APIView):
    def post(self, request, pk):
        edited_paper = request.user.papers.filter(id=pk)
        paper = Paper.objects.create(
            title=request.data["title"],
            url=request.data["url"],
            year=request.data["year"],
            abstract=request.data["abstract"],
            authors=request.data["authors"],
        )
        paper.user.add(request.user)
        remove_papers_for_user(request.user.id, edited_paper)
        return Response({})


class RemovePaperForUser(APIView):
    def post(self, request, pk):
        removed_paper = request.user.papers.filter(id=pk)
        remove_papers_for_user(request.user.id, removed_paper)
        return Response({})


class FetchUserPapers(APIView):
    def post(self, request):
        user = request.user
        import_user_papers.delay(user.id)
        return Response({})


class TriggerDataUpdate(APIView):
    def post(self, request, *args, **kwargs):
        import_user_data.delay(request.user.id)
        return Response({})


class regenerateInterestProfile(APIView):
    def post(self, request, *args, **kwargs):
        regenerate_interest_profile.delay(request.user.id)
        return Response({})


class LongTermInterestView(ListCreateAPIView): # type: ignore
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        order_key = (
            "created_on" if self.request.GET.get("order") == "date" else "-weight"
        )
        return self.request.user.long_term_interests.all().order_by(order_key) # type: ignore

    def post(self, request, *args, **kwargs):
        serializer = ListDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for keyword in serializer.validated_data["keywords"]: # type: ignore
            name, weight, source = keyword["name"], keyword["weight"], keyword["source"]
            keyword_obj, created = Keyword.objects.get_or_create(name=name.lower())

            LongTermInterest.objects.update_or_create(
                user=request.user,
                keyword=keyword_obj,
                defaults={"weight": weight, "source": source},
            )
            # Clear this keyword from blacklist
            BlacklistedKeyword.objects.filter(
                user=request.user, keyword=keyword_obj
            ).delete()
        return Response({})


class LongTermInterestView(ListCreateAPIView):
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        order_key = (
            "created_on" if self.request.GET.get("order") == "date" else "-weight"
        )
        return self.request.user.long_term_interests.all().order_by(order_key) # type: ignore

    def post(self, request, *args, **kwargs):
        serializer = ListDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        found_interests = LongTermInterest.objects.filter(user=request.user)

        # temp_found_interests=found_interests.values()
        ids_found = []
        ids_not_found = []
        try:
            for keyword in serializer.validated_data["keywords"]: # type: ignore
                name = keyword["name"]
                keyword_obj = Keyword.objects.filter(name=name.lower()).values()

                for f in found_interests.values():
                    user_keyword = Keyword.objects.filter(id=f["keyword_id"]).values()
                    try:
                        if user_keyword[0]["name"] == keyword_obj[0]["name"]:
                            ids_found.append(f["keyword_id"])
                        else:
                            ids_not_found.append(f["keyword_id"])
                    except:
                        continue
        except:
            print("error in LongTermInterestView")

        ids_deleted_interests = list(set(ids_not_found) - set(ids_found))
        for keyword in ids_deleted_interests:
            LongTermInterest.objects.filter(keyword_id=keyword).delete()

        for keyword in serializer.validated_data["keywords"]: # type: ignore
            name, weight = keyword["name"], keyword["weight"]
            keyword_obj, created = Keyword.objects.get_or_create(name=name.lower())
            # breakpoint()
            LongTermInterest.objects.update_or_create(
                user=request.user, keyword=keyword_obj, defaults={"weight": weight}
            )
            # Clear this keyword from blacklist
            BlacklistedKeyword.objects.filter(
                user=request.user, keyword=keyword_obj
            ).delete()
        return Response({})


class LongTermInterestItemView(RetrieveUpdateDestroyAPIView):
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        return self.request.user.long_term_interests.all() # type: ignore

    def perform_destroy(self, instance):
        BlacklistedKeyword.objects.update_or_create(
            user=self.request.user, keyword=instance.keyword
        )
        ShortTermInterest.objects.filter(
            keyword=instance.keyword, user=self.request.user
        ).delete()
        return super().perform_destroy(instance)


# jaleh
@api_view(["post"])
def recommended_papers(request, *args, **kwargs):
    # papers = get_recommended_publications(request.data)
    papers = get_recommended_publications_updated(request.data)
    return Response({"message": "Successful", "data": papers})


@api_view(["post"])
def recommended_interests_similarities(request, *args, **kwargs):
    result = get_interest_paper_similarity(request.data)
    return Response({"message": "Successful", "data": result})


@api_view(["post"])
def recommended_keywords_similarities(request, *args, **kwargs):
    res = get_keywords_similarities(request.data)
    return Response({"message": "Successful", "data": res})


# Clara
@api_view(["post"])
def get_data_explore(request, *args, **kwargs):
    res = getDataExplore(request.data)
    # two list: random and all interests
    return Response({"message": "Successful", "data": res})


@api_view(["post"])
def get_data_discover(request, *args, **kwargs):
    res = getDataDiscover(request.data)
    # two list: random and all interests
    return Response({"message": "Successful", "data": res})


@api_view(["post"])
def get_data_similiar_interest(request, *args, **kwargs):
    res = getDataNewInterestExplore(request.data)
    # two list: random and all interests
    return Response({"message": "Successful", "data": res})


@api_view(["post"])
def get_data_connect(request, *args, **kwargs):
    res = getConnectData(request.data)
    # two list: random and all interests
    return Response({"message": "Successful", "data": res})


@api_view(["post"])
def get_wiki_data(request, *args, **kwargs):
    res = getWikiInfo(request.data)
    # two list: random and all interests
    return Response({"message": "Successful", "data": res})


# class RecommendedPublications(APIView):

#     def post(self, request, *args, **kwargs):
#         papers = get_recommended_publications(request.data)
#         # papers = get_recommended_publications_doc_level(request.data)
#         return Response({"message": "Hello, world!", "data": papers})


class PaperView(ListCreateAPIView):
    serializer_class = PaperSerializer

    def get_queryset(self):
        # return self.request.user.papers.filter(paper_id="manual")
        return self.request.user.papers.all().order_by("-year") # type: ignore

    def post(self, request, *args, **kwargs):
        paper = Paper.objects.create(
            title=request.data["title"],
            url=request.data["url"],
            year=request.data["year"],
            abstract=request.data["abstract"],
            authors=request.data["authors"],
        )
        paper.user.add(request.user)
        FetchUserPapers
        return Response({})


class PaperItemView(RetrieveUpdateDestroyAPIView):
    serializer_class = PaperSerializer

    def get_queryset(self):
        return self.request.user.papers.all() # type: ignore


class UserBlacklistedKeywordItemView(DestroyAPIView):
    serializer_class = BlacklistedKeywordSerializer

    def get_queryset(self):
        return self.request.user.blacklisted_keywords.all().order_by("name") # type: ignore


class PublicInterestExtractionView(GenericAPIView):
    """
    Extracts keywords from the specified text based on the selected algorithm
    """

    authentication_classes = ()
    permission_classes = ()
    serializer_class = InterestExtractionSerializer

    def post(self, request, *args, **kwargs):
        inputs = self.serializer_class(data=request.data)
        inputs.is_valid(raise_exception=True)
        payload = inputs.validated_data
        keyword_weight_mapping = getKeyword(
            payload["text"], model=payload["algorithm"], num=payload["num_of_keywords"] # type: ignore
        )
        print("\n\npayload in PublicInterestExtractionView:  ", payload)
        if payload["wiki_filter"]: # type: ignore
            wiki_keyword_redirect_mapping, keyword_weight_mapping = wikifilter(
                keyword_weight_mapping
            )
        keywords = normalize(keyword_weight_mapping)
        return Response(keyword_weight_mapping)


class PublicKeywordSimilarityView(GenericAPIView):
    """
    Returns the similarity score for 2 sets of keywords based on the selected Algorithm
    """

    authentication_classes = ()
    permission_classes = ()
    serializer_class = KeywordSimilariySerializer

    def post(self, request, *args, **kwargs):
        inputs = self.serializer_class(data=request.data)
        inputs.is_valid(raise_exception=True)
        payload = inputs.validated_data
        score = get_interest_similarity_score(
            payload["keywords_1"], payload["keywords_2"], payload["algorithm"] # type: ignore
        )
        return Response({"score": round((score or 0) * 100, 2)})


class PublicKeywordCategoriesView(GenericAPIView):
    """
    Returns the Wikipedia categories of interest terms
    """

    authentication_classes = ()
    permission_classes = ()
    serializer_class = WikiCategoriesSerializer

    def post(self, request, *args, **kwargs):
        inputs = self.serializer_class(data=request.data)
        inputs.is_valid(raise_exception=True)
        payload = inputs.validated_data
        categories = {}
        for interest in payload["interests"]: # type: ignore
            category = wikicategory(interest)
            categories[interest] = category
        return Response(categories)


class UserStreamGraphView(APIView):
    def get(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=kwargs["pk"])
        twitter_data = OrderedDict()
        scholar_data = OrderedDict()
        today = datetime.date.today()

        top_twitter_keywords = list(
            ShortTermInterest.objects.filter(
                user=user, source=ShortTermInterest.TWITTER
            )
            .order_by("-weight")
            .values_list("keyword__name", flat=True)
        )
        top_twitter_keywords = list(set(top_twitter_keywords))[:10]

        top_paper_keywords = list(
            ShortTermInterest.objects.filter(
                user=user, source=ShortTermInterest.SCHOLAR
            )
            .order_by("-weight")
            .values_list("keyword__name", flat=True)
        )
        top_paper_keywords = list(set(top_paper_keywords))[:10]

        for index in range(5, -1, -1):
            # data for last 6 months
            date = today - monthdelta.monthdelta(months=index)
            twitter_data[date.strftime("%B %Y")] = list(
                ShortTermInterest.objects.filter(
                    model_month=date.month,
                    model_year=date.year,
                    user=user,
                    source=ShortTermInterest.TWITTER,
                    keyword__name__in=top_twitter_keywords,
                ).values("keyword__name", "weight")
            )

        for index in range(4, -1, -1):
            # data for last 5 years
            year = today.year - index
            scholar_data[str(year)] = list(
                ShortTermInterest.objects.filter(
                    model_year=year,
                    user=user,
                    source=ShortTermInterest.SCHOLAR,
                    keyword__name__in=top_paper_keywords,
                ).values("keyword__name", "weight")
            )
        response_data = {"twitter_data": twitter_data, "paper_data": scholar_data}
        return Response(response_data)


class UserLongTermInterestView(ListAPIView):
    serializer_class = LongTermInterestSerializer

    def get_queryset(self):
        user = get_object_or_404(User, pk=self.kwargs["pk"])
        top_interests = get_top_long_term_interest_by_weight(user.id, 15) # type: ignore
        top_interests = sorted(
            top_interests, key=lambda interest: interest.weight, reverse=True
        )
        return top_interests


class UserShortTermInterestViewDummy(ListAPIView):
    serializer_class = ShortTermInterestSerializer

    def get(self, request):
        print(get_top_short_term_interest_by_weight(1, 5))
        return Response({"test": get_top_short_term_interest_by_weight(1, 5)})


class UserShortTermInterestView(ListAPIView):
    serializer_class = ShortTermInterestSerializer

    def get_queryset(self):
        user = get_object_or_404(User, pk=self.kwargs["pk"])
        return get_top_short_term_interest_by_weight(user.id, 5) # type: ignore


class UserActivityStatsView(APIView):
    def get(self, request, *args, **kwargs):
        paper_data = OrderedDict()
        tweet_data = OrderedDict()
        user = get_object_or_404(User, pk=kwargs["pk"])

        for paper in Paper.objects.filter(user=user).order_by("year"):
            key_name = paper.year
            paper_data[key_name] = paper_data.get(key_name, 0) + 1

        for tweet in Tweet.objects.filter(user=user).order_by("created_at"):
            key_name = tweet.created_at.strftime("%B %Y") # type: ignore
            tweet_data[key_name] = tweet_data.get(key_name, 0) + 1
        return Response({"papers": paper_data, "tweets": tweet_data})

