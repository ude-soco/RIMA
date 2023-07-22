from django.urls import path
from conferences.views import *


urlpatterns = [

    # TODO: All the author insights urls should be called in this block - START
    path("getAuthorDetails/<pk1>", getAuthorDetails.as_view()),
    path('getNetwokGraphEvents/<pk1>', getNetworkDataSpecificEvents.as_view()),
    path('getNetwokGraphAuthor/<pk1>', getNetworkDataAuthor.as_view()),
    path("getAuthorPublicationCountOverYears/<pk1>",
         getAuthorPublicationsOverYears.as_view()),
    path("getAuthorPublicatinListInYear/<pk1>/<pk2>",
         getAuthorPublicatinInYear.as_view()),
    path("getWordPublicationByYearAndAuthor/<pk1>/<pk2>/<pk3>/",
         getWordPublicationByYearAndAuthor.as_view()),
    path("getPublicationListBasedOnEventName/<pk1>/<pk2>",
         getPublicationListBasedOnEventName.as_view()),
    path('getVennDiagramDate/<pk1>', getVennDiagramDate.as_view()),
    path('getAllAvailabeAuthors/', getAllAvailableAuthors.as_view()),
    path('getAllAvailabeAuthorsFilterBased/<pk1>/<pk2>/',
         getAllAvailabeAuthorsFilterBased.as_view()),
    path('getAuthorPublicationsCitations/<pk1>/<pk2>/',
         getAuthorPublicationsCitations.as_view()),
    path('getAuthorPublicationsCitationsAnalysis/<pk1>/',
         getAuthorPublicationsCitationsAnalysis.as_view()),
    path("getAuthorPublicationCountBasedConfs/<pk1>/<pk2>/",
         getAuthorPublicationCountBasedConfs.as_view()),
    path("getAllAuthorPublicationList/<pk1>/",
         getAllAuthorPublicationList.as_view()),
    path("getAllAvailableConferences/", getAllAvailabelConfs.as_view()),
    path("getAllAvailableEvents/", getAllAvailabelEvents.as_view()),
    path("getAuthorPublications/<pk1>/", getAuthorPublications.as_view()),
    path("getPublicationKeywords/<pk1>/", getPublicationKeywords.as_view()),
    path("getPublicationByID/<pk1>/", getPublicationByID.as_view()),
    path("getPublicationByKeywordOfAuthor/<pk1>/<pk2>/",
         getPublicationByKeywordOfAuthor.as_view()),
    path("getPublicationByTitle/<pk1>/", getPublicationByTitle.as_view()),
    path("getAuthorInterestes/<pk1>/", getAuthorInterestes.as_view()),
    path("coauthor_evolution_over_time/<pk1>/",
         coauthor_evolution_over_time.as_view()),
    path("compareAuthorsBasedPublicationCount/<pk1>/<pk2>",
         compareAuthorsBasedPublicationCount.as_view()),
    path("coauthorEvolutionOverTime/<pk1>",
         coauthor_evolution_over_time.as_view()),
    path("sharedInterestsBetweenAuthor/<pk1>/<pk2>/",
         sharedInterestsBetweenAuthor.as_view()),
    path("sharedPublicationBetweenAuthors/<pk1>/<pk2>/",
         sharedPublicationBetweenAuthors.as_view()),
    path("AuthorProductivityEvolution/<pk1>/<pk2>/",
         AuthorProductivityEvolution.as_view()),
    # TODO: All the author insights urls should be called in this block - END

    ############################################################# islam compare conf. Visulizations updated########################################################################

    path('getTotalSharedAuthorsEvolution/',
         ShareAuthorCompareTrends.as_view()),
    path('getSharedWordsNumber/', SharedKeywordCompareTrends.as_view()),
    path('topTopicsInYears/<pk1>/<pk2>', topWordsOverYears.as_view()),
    path('commonAuthors/<pk1>',
         SharedAuthorsBetweenEventsView.as_view()),
    path('eventAuthors/<pk1>', AuthorEvents.as_view()),
    path('AuthorInterestsNew/<pk1>/<pk2>/<pk3>/<pk4>/<pk5>',
         AuthorInterestsBar2.as_view()),
    path('EventPapers/<pk1>', ConfEventPapers.as_view()),
    path('comparePapers/<pk1>/<pk2>/<pk3>/<pk4>/<pk5>',
         ComparePapersView.as_view()),
    path('compareWordsInPapers/<pk1>/<pk2>/<pk3>', getPapersOfWords.as_view()),
    path('getSharedWordsBar/<pk1>/<pk2>/<pk3>/<pk4>',
         NewconferencesSharedWordsBarView.as_view()),
    path('getSharedWordsBar/<pk1>/<pk2>/<pk3>',
         NewconferencesSharedWordsBarView.as_view()),
    path('AuthorsPapersEvolutio/<pk1>/',
         AuthorsPapersEvolutionView.as_view()),
    path('TotalAuthorsPublicationsEvolution/<pk1>/',
         TotalAuthorsPublicationsEvolution.as_view()),
    path('TotalEventsForEachConf/<pk1>/',
         TotalEventsForEachConf.as_view()),
    ############################################################# islam compare conf. Visulizations updated########################################################################

    # BAB Vis Compare Stackes Area
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
    path('confEvents/<pk1>', confEvents.as_view()),

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

    # ****************************************************Explore topics and trend new created by Islam ******************************
    path('getRelevantPubsCountOfConf/<pk>/',
         RelevantPubsCountOfConf.as_view()),

    path('getSharedTopicsBetweenEvents/<pk1>/',
         SharedTopicsBetweenEvents.as_view()),

    path('getRelaventPublicationsList/<pk1>/<pk2>',
         getRelavantPublicationsList.as_view()),

    path('getTopicPopularityAcrossYears/<pk1>/<pk2>/<pk3>/',
         TopicPopularityAcrossYears.as_view()),

    path('getTopicPublicationsInConf/<pk1>/',
         TopicPopularityInConf.as_view()),


]
