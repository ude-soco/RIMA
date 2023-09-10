from django.urls import path
from conferences.views import *

urlpatterns = [
    path('allAuthors/', getAllAvailableAuthors.as_view()),
    path('allAuthors/filtered/<pk1>/conferences/<pk2>/',
         GetAllAvailabeAuthorsFilterBased.as_view()),

    path('authorsId/<pk1>/interest/<pk2>/',
         GetPublicationByKeywordOfAuthor.as_view()),

    path("authorsId/<pk1>/authorshipEvolution/",
         CoauthorEvolutionOverTime.as_view()),

    path('authorsId/<pk1>/inConferences/<pk2>/publicationsComparison/',
         CompareAuthorsBasedPublicationCount.as_view()),

    path("authorsId/<pk1>/inConferences/<pk2>/sharedInterests/",
         SharedInterestsBetweenAuthor.as_view()),

    path("authorsId/<pk1>/inConferences/<pk2>/sharedPublications/",
         SharedPublicationBetweenAuthors.as_view()),



    path("authorsId/<pk1>/inConferences/<pk2>/productivityEvolution/",
         AuthorProductivityEvolution.as_view()),

    path("authorsId/<pk1>/inConferences/<pk2>/citationCountComparison/",
         CompareAuthorsBasedCitationCountAllConf.as_view()),
]
