import itertools
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from conferences.utils import compare_conferences_utils as compConfUtils
from .. import conference_utils as confutils
from conferences.models.graph_db_entities import *
from neomodel import *
from interests.Keyword_Extractor.extractor import getKeyword
from conferences.conference_utils_cql import cql_get_conference_events
import urllib.parse
from itertools import combinations


# new class by Islam Abdelghaffar

class GetShareAuthorCompareTrends(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        try:
            conferences_list = confutils.split_restapi_url(
                url_splits_question_mark[-4], r'&')
        except Exception as e:
            return Response({"data": [[]],
                             "sharedYears": [[]]
                             })
        confs_events_list = []
        for conf in conferences_list:
            conf_events = compConfUtils.get_conf_events(conf_name=conf)
            confs_events_list.append({
                "conference": conf,
                "events": conf_events
            })

        shared_years = compConfUtils.get_author_keywordTopic_event_based(
            confs_events_list=confs_events_list)

        shared_years_events = compConfUtils.get_shared_events_based_on_shared_years(
            confs_events_list, shared_years)

        shared_authors = compConfUtils.get_shared_authors_from_events(
            shared_years, shared_years_events)

        return Response({
            "data": shared_authors,
            "sharedYears": shared_years
        })

# new class by Islam Abdelghaffar


class GetConfsSimilarityTopicsBased(APIView):
    def get(self, request, *args, **kwargs):
        result_data = []
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        try:
            conferences_list = confutils.split_restapi_url(
                url_splits_question_mark[-4], r'&')
        except Exception as e:
            return Response({"data": [[]],
                             "sharedYears": [[]]
                             })
        confs_events_list = []
        for conf in conferences_list:
            conf_events = compConfUtils.get_conf_events(conf_name=conf)
            confs_events_list.append({
                "conference": conf,
                "events": conf_events
            })

        shared_years = compConfUtils.get_author_keywordTopic_event_based(
            confs_events_list=confs_events_list)

        shared_years_events = compConfUtils.get_shared_events_keyword_based_on_shared_years("keywords",
                                                                                            confs_events_list, shared_years)

        shared_authors = compConfUtils.get_shared_from_events("keywords",
                                                              shared_years, shared_years_events)

        return Response({
            "data": shared_authors,
            "sharedYears": shared_years
        })

# done
# updated by Islam Abdelghaffar


class topWordsOverYears(APIView):
    def get(self, request, *args, **kwargs):
        top_words_over_years = []
        result_words = []
        list_all_events_of_conf = []
        result_weight = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference = url_splits[-2]
        keyword_or_topic = url_splits[-1]
        # orm query  Islam updated
        conference_obj = Conference.nodes.get_or_none(
            conference_name_abbr=conference)
        conference_event_objs = Event.nodes.filter(
            conference_event_name_abbr__startswith=conference_obj.conference_name_abbr)
        for event in conference_event_objs:
            eventstr = ""
            eventstr = event.conference_event_name_abbr
            list_all_events_of_conf.append(eventstr)
        last_five_events = list_all_events_of_conf[-5:]

        top_words_over_years = compConfUtils.get_top_words_in_years(
            last_five_events, keyword_or_topic)
        for key, value in top_words_over_years.items():
            result_words.append(key)
            result_weight.append(value)

        return Response({
            'WordsList': result_words[-10:],
            "values": result_weight[-10:]
        })


# new class by Islam Abdelghaffar


class GetSharedAuthorsBetweenEventsView(APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-3]
        events = url_splits.split('&')
        filtered_events = [event for event in events if event != ""]
        final_sets = []
        authors_name = []

        if (len(filtered_events) == 0):
            return Response({
                "sets": final_sets,
                "names": authors_name
            })

        events_authors = compConfUtils.get_events_authors(filtered_events)

        all_combs = []
        event_names = [item for item in filtered_events]
        for r in range(1, len(event_names) + 1):
            all_combs.extend(combinations(event_names, r))

        results = compConfUtils.get_shared_authors_based_on_combs(
            events_authors, all_combs)

        return Response({
            "sets": results[0],
            "names": results[1]
        })

# updated by Islam Abdelghaffar


class AuthorEvents(APIView):
    def get(self, request, *args, **kwargs):
        first_event_Authors = []
        firstAuthorsFinal = []
        EventAuthorsFinal = []
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        first_event = url_splits[-1]
        # reviewed and works Islam updated
        conference_event_obj_one = Event.nodes.filter(
            conference_event_name_abbr=first_event)
        models_data_one = compConfUtils.get_total_shared_authors_between_conferences(
            conference_event_obj_one)
        first_event_Authors = models_data_one[0]["event_Authors"]

        for firstAuthors in first_event_Authors:

            idString = ""
            idString = firstAuthors[0]
            # reviewed and works Islam updated
            one_event_authors_name = list(set(
                [author.author_name for author in Author.nodes.filter(
                    semantic_scolar_author_id=firstAuthors)]))
            firstAuthorsFinal.append(one_event_authors_name[0])

        for Authors in firstAuthorsFinal:
            EventAuthorsFinal.append({
                'value': Authors,
                'label': Authors,
            })
        return Response({
            "EventAuthors": EventAuthorsFinal
        })


# updated by Islam Abdelghaffar


class GetPopularityOfSharedTopicsBetweenEvents(APIView):
    def get(self, request, *args, **kwargs):
        abstract_title_str = ""
        abstracts_titles = []
        second_event_values = []
        first_event_values = []
        list_of_shared_words = []
        events_list = []
        result_dict = {}
        result_dict['docs'] = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        keyword_or_topic = 'keyword'
        second_event_name_abbr = url_splits[-4]
        first_event_name_abbr = url_splits[-6]
        events_list.append(first_event_name_abbr)
        events_list.append(second_event_name_abbr)

        # islam Updated
        returned_list = compConfUtils.get_shared_words_between_events(
            events_list, keyword_or_topic)

        sharedWords = sorted(
            returned_list[0], key=lambda k: k['weight'], reverse=True)

        for words in sharedWords:
            list_of_shared_words.append(words["word"])
        # islam Updated
        for word in list_of_shared_words:
            # islam Updated
            abstracts_titles = compConfUtils.get_abstract_based_on_keyword(
                first_event_name_abbr, word)
            first_event_values.append(len(abstracts_titles))
        for word in list_of_shared_words:
            # islam Updated
            abstracts_titles = compConfUtils.get_abstract_based_on_keyword(
                second_event_name_abbr, word)

            second_event_values.append(len(abstracts_titles))
        return Response({
            "sharedWords": list_of_shared_words,
            "FirstEventValues": first_event_values,
            "SecondEventValues": second_event_values
        })


# updated by Islam Abdelghaffar


class GetAuthorsPubsEvolutionBetweenConfs(APIView):
    def get(self, request, *args, **kwargs):
        models_data = []
        result_data = []
        no_AuthorPaper = []
        no_SharedAuthor = []
        years_range = []
        all_models_data = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark[-4], r'&')
        authorsOrPubs = url_splits_question_mark[-2]

        for conference in conferences_list:
            # islam Updated
            conference_obj = Conference.nodes.get(
                conference_name_abbr=conference)
            conference_event_objs = Event.nodes.filter(
                conference_event_name_abbr__icontains=conference_obj.conference_name_abbr)

            # islam Updated
            models_data = compConfUtils.get_author_paper_weight_event_based(
                conference_event_objs, authorsOrPubs)
            for model_data in models_data:
                years_range.append(model_data['year'])
            all_models_data.append(models_data)

        years_range = sorted(list(set(years_range)))

        for year in years_range:
            for data in all_models_data:
                ocurrence_list = list(
                    filter(lambda inner_data: inner_data['year'] == year, data))
                if ocurrence_list:
                    sum_weight = 0
                    sum_sharedAuthors = []
                    for result in ocurrence_list:
                        sum_weight += result['no_AuthorPaper']
                        sum_sharedAuthors += result['event_Authors']
                    no_AuthorPaper.append(sum_weight)
                    no_SharedAuthor.append(sum_sharedAuthors)
                    sum_weight = 0
                    sum_sharedAuthors = []
                else:
                    sum_sharedAuthors = []
                    no_AuthorPaper.append(0)
                    no_SharedAuthor.append(sum_sharedAuthors)
            no_SharedAuthor = set.intersection(*map(set, no_SharedAuthor))
            finalist = []
            finalist.append(sum(no_AuthorPaper))
            finalist.append(len(no_SharedAuthor))
            result_data.append(no_AuthorPaper)
            no_AuthorPaper = []
            no_SharedAuthor = []

        return Response({"weights": result_data,
                         "years": years_range
                         })

# updated by Islam Abdelghaffar


class GetTotalAuthorsPublicationsEvolution(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-5]
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark, r'&')

        data = []
        confs = []

        total_authors = []
        for conf in conferences_list:
            conf_author_num = compConfUtils.get_conf_total_authors(conf)
            confs.append(conf)
            total_authors.append(conf_author_num)

        publications_num = []
        for conf in conferences_list:
            conf_publications_num = compConfUtils.get_conf_total_publications(
                conf)
            confs.append(conf)
            publications_num.append(conf_publications_num)

        data.append({
            'Authors': total_authors,
            'Publications': publications_num
        })

        return Response(
            data
        )


# new class by Islam Abdelghaffar

class GetTotalEventsForEachConf(APIView):
    def get(self, request, *args, **kwargs):
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')[-4]
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark, r'&')

        data = []
        for conf in conferences_list:
            events = compConfUtils.get_conf_events(conf)
            data.append({
                "name": conf,
                "data": [len(events)]
            })

        return Response(data)


# updated by Islam Abdelghaffar

class GetConfEvents(APIView):
    def get(self, request, *args, **kwargs):

        url_path = request.get_full_path()
        url_path = url_path.replace("%20", " ")
        confs_split = url_path.split(r"/")
        conferences_events_JSON = []
        if ("&" in confs_split[-1]):
            confs_split = confs_split[-1].split(r'&')
            for conf in confs_split:
                # Islam Updated
                conference_events = [e.conference_event_name_abbr for e in Event.nodes.filter(
                    conference_event_name_abbr__startswith=conf)]
                for event in conference_events:
                    conferences_events_JSON.append({

                        'value': event,
                        'label': event,
                    })
        else:
            conference_events = [e.conference_event_name_abbr for e in Event.nodes.filter(
                conference_event_name_abbr__startswith=confs_split[-1])]
            for event in conference_events:
                conferences_events_JSON.append({

                    'value': event,
                    'label': event,
                })

        return Response({
            "events":
                conferences_events_JSON

        })


# new class created by Islam Abdelghaffar

class GetRelavantPublicationsList(APIView):
    def get(self, request, *args, **kwargs):

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'/')
        keyword_or_topic = 'keyword'

        url_split_And_mark = confutils.split_restapi_url(
            url_splits_question_mark[-5], r'&')
        eventsList = url_split_And_mark
        keywordTopic_name = url_splits_question_mark[-3]

        publication_List = compConfUtils.get_relavant_publication(
            eventsList, keyword_or_topic, keywordTopic_name)

        if publication_List is not None:
            final_pubs_list = [{
                "paper_id": pub.paper_id,
                "title": pub.title,
                "authors": ', '.join([author.author_name for author in pub.authors]),
                "abstract": pub.abstract,
                "year": pub.years,
                "event": pub.published_in[0].conference_event_name_abbr,
                "url": pub.urls
            }for pub in publication_List]

            return Response({
                "publicationList": final_pubs_list
            })

# updated by Islam Abdelghaffar not used anymore in conference insights need to be reviewed


class VennOverview(APIView):
    def get(self, request, *args, **kwargs):
        words_first_event = []
        words_second_event = []
        words_intersect_second_event = []
        models_data_first_event = []
        models_data_second_event = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')

        first_event = url_splits[-2]
        second_event = url_splits[-1]
        keyword_or_topic = url_splits[-3]

        if keyword_or_topic == 'topic':
            # Islam Updated
            models_data_first_event = compConfUtils.get_topics_from_models(
                first_event)
            models_data_second_event = compConfUtils.get_topics_from_models(
                second_event)

        elif keyword_or_topic == 'keyword':
            # Islam Updated
            models_data_first_event = compConfUtils.get_keywords_from_models(
                first_event)
            models_data_second_event = compConfUtils.get_keywords_from_models(
                second_event)

        for data in models_data_first_event:
            words_first_event.append(data.get(keyword_or_topic))

        for data in models_data_second_event:
            words_second_event.append(data.get(keyword_or_topic))
        # Islam Updated
        models_data_intersect_first_and_second = compConfUtils.get_shared_words_between_events(
            [first_event, second_event], keyword_or_topic)

        if len(models_data_intersect_first_and_second) > 0:
            for data in models_data_intersect_first_and_second[0]:
                words_intersect_second_event.append(data['word'])

        ctx = confutils.generate_venn_photo(
            words_first_event[0:10], words_second_event[0:10], words_intersect_second_event[0:10], first_event, second_event, keyword_or_topic)

        return Response({
            "commontopics": ctx
        })


# new class created by Islam not used anymore in conference insights need to be reviewed
class RelevantPublicationsOfKeywords(APIView):
    def get(self, request, *args, **kwargs):

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        url_splits_conference_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        conference_name_abbr = url_splits_conference_name[-2]
        words_split_params = url_splits_question_mark[-1].split("&")

        publications = compConfUtils.get_relavant_publication_for_aList(
            conference_name_abbr, words_split_params)
        years = compConfUtils.conf_all_years(conference_name_abbr)
        if publications is not None:
            names = [obj['name'] for obj in publications]
            data = [obj['data'] for obj in publications]

            return Response({
                "names": names,
                "data": data,
                "years": years
            })


# updated by Islam Abdelghaffar not used anymore in conference insights need to be reviewed

class MultipleTopicAreaView(APIView):
    def get(self, request, *args, **kwargs):
        models_data = []
        result_data = []
        weights = []
        events = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        url_splits_conference_name = confutils.split_restapi_url(
            request.get_full_path(), r'/')

        conference_name_abbr = url_splits_conference_name[-2]
        words_split_params = url_splits_question_mark[-1].split("&")
        # islam Updated
        conference_obj = Conference.nodes.get(
            conference_name_abbr=conference_name_abbr)
        conference_event_objs = Event.nodes.filter(
            conference_event_name_abbr__startswith=conference_obj.conference_name_abbr)

        for word in words_split_params:
            models_data = compConfUtils.get_word_weight_event_based(
                conference_event_objs, word, url_splits_conference_name[-3])
            for model_data in models_data:
                weights.append(model_data['weight'])
                events.append(model_data['conference_event_abbr'])
            result_data.append(weights)
            weights = []

        return Response({
            "weights": result_data,
            "years": list(sorted(set(events), key=events.index))
        })

# updated by Islam Abdelghaffar not used anymore in conference insights need to be reviewed


class NewconferencesSharedWordsBarView(APIView):
    def get(self, request, *args, **kwargs):
        result_data = [[], []]
        avaiable_events = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')

        if len(url_splits) == 8:
            keyword_or_topic = url_splits[-4]
            first_event = url_splits[-3]
            second_event = url_splits[-2]
            third_event = url_splits[-1]
            avaiable_events.append(first_event)
            avaiable_events.append(second_event)
            avaiable_events.append(third_event)

        else:
            keyword_or_topic = url_splits[-3]
            first_event = url_splits[-2]
            second_event = url_splits[-1]
            avaiable_events.append(first_event)
            avaiable_events.append(second_event)
        # islam Updated
        result_data = compConfUtils.get_shared_words_between_events(
            avaiable_events, keyword_or_topic)

        return Response({'Topiclist': result_data})

# new class by Islam Abdelghaffar not used anymore in conference insights need to be reviewed


class AuthorInterestsBar2 (APIView):
    def get(self, request, *args, **kwargs):
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        second_author = url_splits[-1]
        first_author = url_splits[-2]
        keyword_or_topic = url_splits[-3]
        second_event = url_splits[-4]
        first_event = url_splits[-5]

        first_author_data = compConfUtils.get_author_keywordTopic_event_based(
            author_name=first_author,
            event_name=first_event,
            keyword_or_topic=keyword_or_topic)

        second_author_data = compConfUtils.get_author_keywordTopic_event_based(
            author_name=second_author,
            event_name=second_event,
            keyword_or_topic=keyword_or_topic)

        intersection = compConfUtils.get_commen_keywords_or_topics(
            first_author_data, second_author_data)

        return Response({
            "first_author_data": first_author_data,
            "second_author_data": second_author_data,
            "common_data": intersection
        })

# updated by Islam Abdelghaffar not used anymore in conference insights need to be reviewed


class ConfEventPapers(APIView):
    def get(self, request, *args, **kwargs):
        Event_papers_JSON = []
        Event_papersWithAbstract_JSON = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference_event_name_abbr = url_splits[-1]
        # Islam Updated
        conference_event_papers_data = compConfUtils.get_event_papers_data(
            conference_event_name_abbr)
        conference_event_papers_data_list = list(conference_event_papers_data)
        for paper in conference_event_papers_data_list:
            Event_papers_JSON.append({
                'value': paper.title,
                'label': paper.title,
            })
            Event_papersWithAbstract_JSON.append({
                'value': paper.title,
                'label': paper.title,
                'abstract': paper.abstract
            })

        return Response({
            "papers":
            Event_papers_JSON,
            "paperWithAbstract":
            Event_papersWithAbstract_JSON
        })

# new class by Islam Abdelghaffar not used anymore in conference insights need to be reviewed


class ComparePapersView(APIView):
    def get(self, request, *args, **kwargs):
        data = []
        common_keywords_or_topics = []
        rl_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        comparison_based = rl_splits[4]
        first_paper = urllib.parse.unquote(rl_splits[5])
        second_paper = urllib.parse.unquote(rl_splits[7])
        first_paper_keywordsCount = compConfUtils.get_publication_keywords_count(
            first_paper, str(comparison_based))

        second_paper_keywordsCount = compConfUtils.get_publication_keywords_count(
            second_paper, str(comparison_based))

        intersection = compConfUtils.get_commen_keywords_or_topics(
            first_paper_keywordsCount, second_paper_keywordsCount)

        if intersection:
            data.append({
                "firstPaper": first_paper_keywordsCount,
                "secondPaper": second_paper_keywordsCount,
                "common_keywords_topics": intersection[0]["intersection"],
                "intersectionDetails": intersection[0]["intersectionDetails"]
            })
        else:
            data.append({
                "firstPaper": first_paper_keywordsCount,
                "secondPaper": second_paper_keywordsCount,
            })

        return Response({
            "data": data
        })
