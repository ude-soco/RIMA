from django.urls import path, include
from conferences.views import *

urlpatterns = [

    path('topics/popularityEvolution/',
         GetEvolutionTopPopularTopicsInConf.as_view()),

    path('events/<pk2>/sharedTopics/',
         GetSharedTopicsAcrossEvents.as_view()),

    path('events/<pk2>/numberOfKeyphrases/<pk3>/OnlyShared/<pk4>/',
         GetSharedPopularTopicsAcrossYears.as_view()),

    path('topics/topPopularTopics/',
         GetTopPopularTopicsInConf.as_view()),

    path('event/<pk2>/word/<pk3>/publications/',
         GetRelavantPublicationsList.as_view()),

]
