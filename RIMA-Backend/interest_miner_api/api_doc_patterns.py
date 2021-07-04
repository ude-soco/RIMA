from django.urls import path

from interests import views
from conferences import views as confViews

doc_patterns = [
    path(
        'api/interests/interest-extraction/',
        views.PublicInterestExtractionView.as_view(),
    ),
    path('api/interests/similarity/',
         views.PublicKeywordSimilarityView.as_view()),
    #path('api/interests/laktopics/', confViews.TopicsView.as_view()),
    path('api/interests/interest-extraction/wiki-categories/',
         views.PublicKeywordCategoriesView.as_view()),
]
