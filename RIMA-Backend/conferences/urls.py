# Updated by Basem Abughallya 08.06.2021:: Extension for other conferences other than LAK 


from django.urls import path
from . import views


urlpatterns = [
    
    # BAB Vis Compare Stackes Area
    path('conferencesNames/', views.conferencesNamesView.as_view()), # BAB 
    path('getSharedWords/<pk1>/', views.conferencesSharedWordsView.as_view()), 
    path('getSharedWordEvolution/<pk1>/<pk2>/', views.SharedWordEvolutionView.as_view()),
    path('getSharedYears/', views.conferencesYearsRangeView.as_view()), 

    path('getSharedWordsBar/<pk1>/<pk2>/', views.conferencesSharedWordsBarView.as_view()),


    path('addConference/', views.addConferenceView.as_view()), # BAB
    path('ConferenceEvents/<slug:conference_name_abbr>', views.ConferenceEventsView.as_view()), # BAB 
    path('conferenceAuthors/<slug:conference_name_abbr>', views.conferenceAuthors.as_view()), # BAB 
    path('AuthorPublication/<pk1>/<pk2>', views.AuthorPublications.as_view()),

    path('collectEventPapers/<slug:conference_name_abbr>/<slug:conference_event_name_abbr>', views.CollectEventPapersView.as_view()), # BAB
    path('ExtractEventTrends/<slug:conference_event_name_abbr>', views.ExtractEventTrendsView.as_view()), # BAB 
    path('ExtractAuthorsTrends/<slug:conference_event_name_abbr>', views.ExtractAuthorsTrendsView.as_view()),

    path('searchConf/', views.searchConfView.as_view()), # BAB

    path('wordcloud/<pk1>/<pk2>/<pk3>', views.WordCloudView.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('wordCloudAuthor/<pk1>/<pk2>/<pk3>/<pk4>', views.AuthorWordCloudView.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK

     # TO BE REMOVED
    #path('lakkeywords/<pk1>/<pk2>/<pk3>', views.KeywordsView.as_view()),  #BAB 08.06.2021 Extension for other conferences other than LAK 
    #path('lakkeywords/<pk1>/<pk2>/<pk3>', views.KeywordsView.as_view()),  #BAB 08.06.2021 Extension for other conferences other than LAK 

    path('confEvents/<pk1>', views.confEvents.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK 

    path('alltopics/', views.AllTopicsViewDB.as_view()),

    # modified --> can be merged to one
    #   
    path('topkeywords/<pk1>/<pk2>', views.TopicBarView.as_view()),  #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('toptopics/<pk1>/<pk2>', views.TopicBarView.as_view()),  #BAB 08.0s6.2021 Extension for other conferences other than LAK 
    ###
    path('topicdetails/<pk1>/<pk2>', views.getTopicBarValues.as_view()),   



     
    path('populatetopics/<pk>', views.populateTopicView.as_view()),
    path('populatekeys/<pk>', views.populateKeyView.as_view()),

    path('keydetails/<pk1>/<pk2>', views.getKeyBarValues.as_view()),
    path('comparetopics/', views.vennPlotView.as_view()),

    # Area chart
    path('getalltopicsresults/topic/<pk1>', views.allWords.as_view()),  #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('getallkeysresults/keyword/<pk1>', views.allWords.as_view()),   #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('getalltopicsevolution/topic/<pk>/', views.MultipleTopicAreaView.as_view()),   #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('getallkeysevolution/keyword/<pk>/', views.MultipleTopicAreaView.as_view()),    #BAB 08.06.2021 Extension for other conferences other than LAK 
    
    
    
    path('gettopicsforpie/<pk1>/<pk2>/<pk3>', views.TopicPieView.as_view()),   #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('getkeysforpie/<pk1>/<pk2>/<pk3>', views.TopicPieView.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK 
    
    
    path('gettopicsyearwise/<pk>', views.AllTopicDicts.as_view()),


    path('fetchpaper/<pk1>', views.FetchPaperView.as_view()), 
    path('fetchallauthors/', views.AuthorsFetchView.as_view()),
    #path('fetchallauthorsdict/', views.AuthorsDictFetchView.as_view()),
    path('topicoverview/', views.TopicOverview.as_view()),

    path('commontopics/<pk1>/<pk2>/<pk3>', views.VennOverview.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('commonkeys/<pk1>/<pk2>/<pk3>', views.VennOverview.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK

     #under work
    path('getallkeywords/<pk1>/<pk2>', views.AllKeywordsView.as_view()),
    path('getalltopics/<pk1>/<pk2>', views.AllTopicsView.as_view()),
    path('getalltitles/<pk1>/<pk2>', views.SearchKeywordView.as_view()),
    
    path('searchtopic/<pk1>/<pk2>', views.SearchTopicView.as_view()),

    # stacked bar
    path('getalltopiclist/topic/', views.FetchTopicView.as_view()),  #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('getallkeylist/keyword/', views.FetchTopicView.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK
    
    
    path('getallauthorslist/<pk1>/<pk2>/<pk3>',
         views.FetchAuthorView.as_view()),
    path('getallauthorsdict/', views.FetchAuthorsDict.as_view()),
    path('getauthorsyearlist/<pk1>/<pk2>', views.AuthorFetchYearView.as_view()), 

    path('getoverviewtopicdetails/<pk1>/<pk2>',
         views.OverviewChartViewTopics.as_view()),
    path('getoverviewkeydetails/<pk1>/<pk2>',
         views.OverviewChartViewKeywords.as_view()),
    path('getabstractdetails/<pk1>/<pk2>/<pk3>', views.FetchAbstractView.as_view()), #BAB 08.06.2021 Extension for other conferences other than LAK 
    path('getauthortopicdetails/<pk>/', views.AuthorTopicComparisonView.as_view()),
    #path('getauthorkeydetails/',views.AuthorKeywordComparisonView.as_view()),
    path('getauthorvsconfdetails/<pk1>/<pk2>',
         views.CompareAuthorConf.as_view()),
    path('insertauthordb/', views.AuthorDBInsertView.as_view()),
    path('authorcomparison/<pk1>/<pk2>', views.AuthorComparisonData.as_view()),
    path('authorconfcomparison/<pk1>/<pk2>/<pk3>/<pk4>', views.AuthorConfComparisionView.as_view()),
    path('updatealltopics/', views.UpdateAllTopics.as_view()),
    #added by mouadh
    path('getsimilarity/', views.similartweets.as_view()),
]