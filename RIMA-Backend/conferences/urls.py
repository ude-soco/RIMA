from django.urls import path, include
from conferences.views import *
from conferences import urls_author_insights
from conferences import urls_compare_authors
from conferences import urls_compare_conferences
from conferences import urls_explore_topics_and_trends

urlpatterns = [

    # Conference Insights Endpoints in this block by Islam Abdelghaffar- START
    path("author/<pk1>/", include(urls_author_insights)),
    path("authors/", include(urls_compare_authors)),
    path("conferences/", include(urls_compare_conferences)),
    path("conference/<pk1>/", include(urls_explore_topics_and_trends)),

    path("publication/<pk1>/keywords/", GetPublicationKeywords.as_view()),
    path("publicationId/<pk1>/", GetPublicationByID.as_view()),
    path("publicationTitle/<pk1>/", GetPublicationByTitle.as_view()),

    path('confEvents/<pk1>', GetConfEvents.as_view()),

    # Conference Insights Endpoints  in this block - END

    ############################################################# compare conf. Visulizations updated########################################################################

     #BAB need to be reviewed
    path('topTopicsInYears/<pk1>/<pk2>', topWordsOverYears.as_view()),

    path('eventAuthors/<pk1>', AuthorEvents.as_view()),
#     path('AuthorInterestsNew/<pk1>/<pk2>/<pk3>/<pk4>/<pk5>',
#          AuthorInterestsBar2.as_view()),
    path('EventPapers/<pk1>', ConfEventPapers.as_view()),
    path('comparePapers/<pk1>/<pk2>/<pk3>/<pk4>/<pk5>',
         ComparePapersView.as_view()),
    path('getSharedWordsBar/<pk1>/<pk2>/<pk3>/<pk4>',
         NewconferencesSharedWordsBarView.as_view()),
    path('getSharedWordsBar/<pk1>/<pk2>/<pk3>',
         NewconferencesSharedWordsBarView.as_view()),


    ############################################################# compare conf. Visulizations########################################################################

    # BAB Vis Compare Stackes Area need to be reviewed
    path('constructDatabase/', constructDatabase.as_view()),
    path('conferencesNames/', conferencesNamesView.as_view()),  # BAB
    path('getSharedWords/<pk1>/', conferencesSharedWordsView.as_view()),
    path('getSharedWordEvolution/<pk1>/<pk2>/',
         SharedWordEvolutionView.as_view()),
    path('getSharedYears/', conferencesYearsRangeView.as_view()),

    path('conference/<str:pk>/', conferenceDeleteView.as_view()),

    path('getSharedWordsBar/<pk1>/<pk2>/',
         conferencesSharedWordsBarView.as_view()),
    path('conferencetest/<pk1>', testGeneralDataView.as_view()),

    path('conferenceData/<pk1>', conferenceGeneralDataView.as_view()),
    # TimeLine
    path('getDataTimeLineChart/<pk1>/', DataTimeLineChartView.as_view()),

    path('addConference/', addConferenceView.as_view()),  # BAB
    path('ConferenceEvents/<slug:conference_name_abbr>',
         ConferenceEventsView.as_view()),  # BAB
    path('conferenceAuthors/<slug:conference_name_abbr>',
         conferenceAuthors.as_view()),  # BAB
    path('AuthorPublication/<pk1>/<pk2>', AuthorPublications.as_view()),

    path('collectEventPapers/<slug:conference_name_abbr>/<slug:conference_event_name_abbr>',
         CollectEventPapersView.as_view()),  # BAB
    path('ExtractEventTrends/<slug:conference_event_name_abbr>',
         ExtractEventTrendsView.as_view()),  # BAB
    path('ExtractAuthorsTrends/<slug:conference_event_name_abbr>',
         ExtractAuthorsTrendsView.as_view()),

    path('searchConf/', searchConfView.as_view()),  # BAB

    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('wordcloud/<pk1>/<pk2>/<pk3>', WordCloudView.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('wordCloudAuthor/<pk1>/<pk2>/<pk3>/<pk4>',
         AuthorWordCloudView.as_view()),


    # BAB 08.06.2021 Extension for other conferences other than LAK
    # resued by abdalla

    path('alltopics/', AllTopicsViewDB.as_view()),

    # modified --> can be merged to one
    #
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('topkeywords/<pk1>/<pk2>', TopicBarView.as_view()),
    # BAB 08.0s6.2021 Extension for other conferences other than LAK
    path('toptopics/<pk1>/<pk2>', TopicBarView.as_view()),
    ###
    path('topicdetails/<pk1>/<pk2>/<pk3>', getTopicBarValues.as_view()),




    path('populatetopics/<pk>', populateTopicView.as_view()),
    path('populatekeys/<pk>', populateKeyView.as_view()),

    path('keydetails/<pk1>/<pk2>', getKeyBarValues.as_view()),
    path('comparetopics/', vennPlotView.as_view()),

    # Area chart
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('getalltopicsresults/topic/<pk1>', allWords.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('getallkeysresults/keyword/<pk1>', allWords.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK

    # reused by Abdallah
    path('getalltopicsevolution/topic/<pk>/',
         MultipleTopicAreaView.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    # reused by Abdallah
    path('getallkeysevolution/keyword/<pk>/',
         RelevantPublicationsOfKeywords.as_view()),

    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('gettopicsforpie/<pk1>/<pk2>/<pk3>', TopicPieView.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('getkeysforpie/<pk1>/<pk2>/<pk3>', TopicPieView.as_view()),


    path('gettopicsyearwise/<pk>', AllTopicDicts.as_view()),


    path('fetchpaper/<pk1>', FetchPaperView.as_view()),
    path('fetchallauthors/', AuthorsFetchView.as_view()),
    # path('fetchallauthorsdict/', AuthorsDictFetchView.as_view()),
    path('topicoverview/', TopicOverview.as_view()),

    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('commontopics/<pk1>/<pk2>/<pk3>', VennOverview.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('commonkeys/<pk1>/<pk2>/<pk3>', VennOverview.as_view()),

    # under work
    path('getallkeywords/<pk1>/<pk2>', AllKeywordsView.as_view()),
    path('getalltopics/<pk1>/<pk2>', AllTopicsView.as_view()),
    # path('getalltitles/<pk1>/<pk2>', SearchKeywordView.as_view()),
    path('getalltitles/keyword/<pk1>/<pk2>', SearchKeywordView.as_view()),
    path('getalltitles/topic/<pk1>/<pk2>', SearchKeywordView.as_view()),

    path('searchtopic/<pk1>/<pk2>', SearchTopicView.as_view()),

    # stacked bar
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('getalltopiclist/topic/', FetchTopicView.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('getallkeylist/keyword/', FetchTopicView.as_view()),


    path('getallauthorslist/<pk1>/<pk2>/<pk3>',
         FetchAuthorView.as_view()),
    path('getallauthorsdict/', FetchAuthorsDict.as_view()),
    path('getauthorsyearlist/<pk1>/<pk2>', AuthorFetchYearView.as_view()),

    path('getoverviewtopicdetails/<pk1>/<pk2>',
         OverviewChartViewTopics.as_view()),
    path('getoverviewkeydetails/<pk1>/<pk2>',
         OverviewChartViewKeywords.as_view()),
    # BAB 08.06.2021 Extension for other conferences other than LAK
    path('getabstractdetails/<pk1>/<pk2>/<pk3>',
         FetchAbstractView.as_view()),
    path('getauthortopicdetails/<pk>/',
         AuthorTopicComparisonView.as_view()),
    # path('getauthorkeydetails/',AuthorKeywordComparisonView.as_view()),
    path('getauthorvsconfdetails/<pk1>/<pk2>',
         CompareAuthorConf.as_view()),
    path('insertauthordb/', AuthorDBInsertView.as_view()),
    path('authorcomparison/<pk1>/<pk2>', AuthorComparisonData.as_view()),
    path('authorconfcomparison/<pk1>/<pk2>/<pk3>/<pk4>',
         AuthorConfComparisionView.as_view()),
    path('updatealltopics/', UpdateAllTopics.as_view()),
]
