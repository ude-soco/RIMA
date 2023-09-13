# created by Islam Abdelghaffar
from django.urls import path
from conferences.views import *

urlpatterns = [
    path('allConferences/', GetAllAvailabelConfs.as_view()),
   
    path("allEvents/", GetAllAvailabelEvents.as_view()),

    path('confsName/<pk1>/sharedAuthors/evolution/',
         GetShareAuthorCompareTrends.as_view()),

    path('confsName/<pk1>/sharedTopics/evolution/',
         GetConfsSimilarityTopicsBased.as_view()),

    path('events/<pk1>/sharedAuthors/',
         GetSharedAuthorsBetweenEventsView.as_view()),

    path('firstEvent/<pk1>/secondEvent/<pk2>/sharedTopics/comparePopularity/',
         GetPopularityOfSharedTopicsBetweenEvents.as_view()),

    path('confsName/<pk1>/authors/authorsEvolution/',
         GetAuthorsPubsEvolutionBetweenConfs.as_view()),

    path('confsName/<pk1>/publications/publicationsEvolution/',
         GetAuthorsPubsEvolutionBetweenConfs.as_view()),

    path('confsName/<pk1>/authors/publications/evolution/',
         GetTotalAuthorsPublicationsEvolution.as_view()),

    path('confsName/<pk1>/events/totalNumber/',
         GetTotalEventsForEachConf.as_view()),
]
