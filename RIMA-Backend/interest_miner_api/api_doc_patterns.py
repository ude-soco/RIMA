from django.urls import path

from interests import views

doc_patterns = [
    path(
        'api/interests/interest-extraction/',
        views.PublicInterestExtractionView.as_view(),
    ),
    path('api/interests/similarity/', views.PublicKeywordSimilarityView.as_view()),
]
