#created by Islam Abdelghaffar

from django.urls import path
from conferences.views import *

urlpatterns = [
    path('allAuthors/', GetAllAvailableAuthors.as_view()),
    path('allAuthors/filtered/<pk1>/conferences/<pk2>/',
         GetAllAvailabeAuthorsFilterBased.as_view()),

    path('authorsId/<pk1>/interest/<pk2>/',
         GetPublicationByKeywordOfAuthor.as_view()),

    path("authorsId/<pk1>/authorshipEvolution/",
         GetCoauthorEvolutionOverTime.as_view()),

    path('authorsId/<pk1>/inConferences/<pk2>/publicationsComparison/',
         GetCompareAuthorsBasedPublicationCount.as_view()),

    path("authorsId/<pk1>/inConferences/<pk2>/sharedInterests/",
         GetSharedInterestsBetweenAuthor.as_view()),

    path("authorsId/<pk1>/inConferences/<pk2>/sharedPublications/",
         GetSharedPublicationBetweenAuthors.as_view()),



    path("authorsId/<pk1>/inConferences/<pk2>/productivityEvolution/",
         GetAuthorProductivityEvolution.as_view()),

    path("authorsId/<pk1>/inConferences/<pk2>/citationCountComparison/",
         GetCompareAuthorsBasedCitationCountAllConf.as_view()),
]
