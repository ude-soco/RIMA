from django.urls import path

from . import views

urlpatterns = [
    path("trigger-paper-updata/", views.TriggerPaperUpdate.as_view()),
    path("trigger-data-updata/", views.TriggerDataUpdate.as_view()),
    path("long-term/", views.LongTermInterestView.as_view()),
    path("long-term/<int:pk>/", views.LongTermInterestItemView.as_view()),
    path("papers/<int:pk>/", views.PaperItemView.as_view()),
    path(
        "black-listed-keywords/<int:pk>/",
        views.UserBlacklistedKeywordItemView.as_view(),
    ),
    path("interest-extraction/", views.PublicInterestExtractionView.as_view()),
    path("similarity/", views.PublicKeywordSimilarityView.as_view()),
    path(
        "interest-extraction/wiki-categories/",
        views.PublicKeywordCategoriesView.as_view(),
    ),
    path("short-term/user/<int:pk>/", views.UserShortTermInterestView.as_view()),
    path("long-term/user/<int:pk>/", views.UserLongTermInterestView.as_view()),
    # to be removed
    path("long/", views.UserShortTermInterestViewDummy.as_view()),
    path("activity-stats/user/<int:pk>/", views.UserActivityStatsView.as_view()),
    path("stream-graph/user/<int:pk>/", views.UserStreamGraphView.as_view()),
    path("recommended-tweets", views.recommended_tweets),
    path("tweets", views.TweetView.as_view()),
    path("tweets/<slug:id_str>", views.DeleteTweetView.as_view()),
    path("hello", views.HelloView.as_view()),
    # Jaleh
    path("recommended-publications", views.recommended_papers),
    path(
        "recommended-interests-similarities", views.recommended_interests_similarities
    ),
    path("recommended-keyword-similarities", views.recommended_keywords_similarities),
    # Clara6
    path("get-discover-data", views.get_data_discover),
    path("get-explore-data", views.get_data_explore),
    path("get-similiar-interest-data", views.get_data_similiar_interest),
    # Osama
    path("papers/", views.PaperView.as_view()),  # adding new paper
    path("reset-data/", views.ResetData.as_view()),
    path("edit-paper/<int:pk>/", views.EditPaper.as_view()),
    path("remove-paper-for-user/<int:pk>/", views.RemovePaperForUser.as_view()),
    path("fetch-papers/", views.FetchUserPapers.as_view()),
    path("regenerate-interest-profile/", views.regenerateInterestProfile.as_view()),
    path("get-connect-data", views.get_data_connect),
    path("get-wiki-info", views.get_wiki_data),
]
