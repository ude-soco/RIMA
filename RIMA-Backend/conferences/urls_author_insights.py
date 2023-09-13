#created by Islam Abdelghaffar

from django.urls import path
from conferences.views import *

urlpatterns = [
    path("details/", GetAuthorDetails.as_view()),

    path("publications/",
         GetAllAuthorPublicationList.as_view()),

    path('coauthorNetwork/', GetNetworkDataAuthor.as_view()),
    path("publicationCountOverYears/",
         GetAuthorPublicationsOverYears.as_view()),

    path("interest/<pk2>/year/<pk3>/publication/",
         GetWordPublicationByYearAndAuthor.as_view()),

    path("eventYear/<pk2>/publication/",
         GetPublicationListBasedOnEventName.as_view()),

    path('publications/citations/inConferences/<pk2>/',
         GetAuthorPublicationsCitations.as_view()),

    path('publicationsCount/inConferences/<pk2>/',
         GetAuthorPublicationCountBasedConfs.as_view()),

    path("publicationsSorted/", GetAuthorPublications.as_view()),

    path("allInterests/", GetAuthorInterestes.as_view()),

]
