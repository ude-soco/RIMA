
import itertools
from rest_framework.views import APIView
from rest_framework.response import Response

from conferences.utils import compare_conferences_utils as compConfUtils
from .. import conference_utils as confutils
from conferences.models.conference import Conference
from conferences.models.event import Event
from conferences.models.author import Author
from neomodel import *


class TotalSharedAuthorsEvolutionView(APIView):
    def get(self, request, *args, **kwargs):
        models_data = []
        result_data = []
        no_AuthorPaper = []
        no_SharedAuthor = []
        years_range = []
        all_models_data = []

        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        print(url_splits_question_mark, "BAB TEST AND")
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark[1], r'&')

        for conference in conferences_list:

            # conference_obj = Conference.objects.get(conference_name_abbr=conference)
            # neomodel query
            conference_obj = Conference.nodes.get(
                conference_name_abbr=conference)

            # conference_event_objs = Conference_Event.objects.filter(conference_name_abbr = conference_obj)
            # neomodel query , review and the results are correct
            conference_events_objs = Event.nodes.filter(
                conference_event_name_abbr__startswith=conference_obj.conference_name_abbr)
            # call utils function  from compare_conferences.utils.py # reviewed and works
            models_data = compConfUtils.get_TotalSharedAuthors_between_conferences(
                conference_events_objs)
            print('***'*50)
            print(models_data)
            # print(models_data['no_AuthorPaper'])
            print('***'*50)
            for model_data in models_data:
                years_range.append(model_data['year'])
            all_models_data.append(models_data)

        years_range = sorted(list(set(years_range)))
        # has neomodel query reviewed and works
        shared_years = compConfUtils.get_years_range_of_conferences(
            conferences_list, 'shared')
        shared_years = sorted(list(set(shared_years)))
        print("shared_years: ", shared_years)

        for year in shared_years:
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
            result_data.append(finalist)
            no_AuthorPaper = []
            no_SharedAuthor = []

        print('result_data')
        print(all_models_data)
        print('++++++++++++++++++')
        print(result_data)
        print('++++++++++++++++++')
        print(years_range)
        print('result_data')
       # result_data = [y for x in result_data for y in x]

        return Response({"weights": result_data,
                         "years": shared_years
                         })


class TotalSharedWordsNumberView(APIView):
    def get(self, request, *args, **kwargs):
        models_data = []
        result_data = []
        conferences_events_list = []
        avaiable_events = []
        not_available_events = []
        models_data = []
        conferences_list = []
        keyword_or_topic = "topic"
        url_splits_question_mark = confutils.split_restapi_url(
            request.get_full_path(), r'?')
        conferences_list = confutils.split_restapi_url(
            url_splits_question_mark[1], r'&')
        # has neomodel quries , reviewed and works
        models_data = compConfUtils.get_years_range_of_conferences(
            conferences_list, 'shared')
        models_data2 = compConfUtils.get_years_range_of_conferences(
            conferences_list, 'all')
        print("ALL SHARED YEAAAAAAAARSSSSSSSS")
        print(models_data)
        models_data = sorted(list(set(models_data)))
        print("ALL SOOOORTED SHARED YEAAAAAAAARSSSSSSSS")
        print(models_data)
        for year in models_data:
            for conference in conferences_list:
                conferences_events_list.append(conference+year)
                if int(year) < 2000:
                    conferences_events_list.append(conference+year[2:])

            print("conferences_events_list heeereeeee")
            print(conferences_events_list)

            for conference_event in conferences_events_list:
                event_is_available = Event.nodes.get_or_none(
                    conference_event_name_abbr=conference_event)
                if event_is_available and event_is_available is not None:
                    model_events = Event.nodes.filter(
                        conference_event_name_abbr__icontains=conference_event)
                    for model_event in model_events:
                        avaiable_events.append(
                            model_event.conference_event_name_abbr)

                else:
                    not_available_events.append(conference_event)
            print("avaiable_events areeeee")
            print(avaiable_events)
            keyword_or_topic = "topic"
            sharedWords = compConfUtils.get_shared_words_numbers(
                avaiable_events, keyword_or_topic)
            finalist = []
            finalist.append(sharedWords)
            keyword_or_topic = "keyword"
            sharedWords = compConfUtils.get_shared_words_numbers(
                avaiable_events, keyword_or_topic)
            finalist.append(sharedWords)
            result_data.append(finalist)
            conferences_events_list = []
            avaiable_events = []

        return Response({"weights": result_data,
                         "years": models_data,
                         "allYears": models_data2
                         })


class topWordsOverYears(APIView):

    def get(self, request, *args, **kwargs):
        top_words_over_years = []
        result_words = []
        list_all_events_of_conf = []
        resulte_weight = []

        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        conference = url_splits[-2]
        keyword_or_topic = url_splits[-1]
        print("selected conference")
        print(conference)
        print("selected conference")
        # orm query
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

        print('Modelsssssssssss data yearssssssss')
        print(top_words_over_years)

        for key, value in top_words_over_years.items():
            result_words.append(key)
            resulte_weight.append(value)
        return Response({
            'WordsList': result_words[-10:],
            "values": resulte_weight[-10:]
        })


class CommonAuthorsview(APIView):
    def get(self, request, *args, **kwargs):
        first_event_Authors = []
        second_event_Author = []
        Authors_intersect_second_event = []
        firstAuthorsFinal = []
        keyword_or_topic = "Author"
        secondAuthorsFinal = []
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        sharedAuthorsFinal = []

        first_event = url_splits[-2]
        second_event = url_splits[-1]
        print("here are the two events")
        print(first_event)
        print(second_event)
        # ORM query to update
        conference_event_obj_one = Event.nodes.filter(
            conference_event_name_abbr=first_event)
        models_data_one = compConfUtils.get_TotalSharedAuthors_between_conferences(
            conference_event_obj_one)
        print("here are the returned data")
        print(models_data_one)
        first_event_Authors = models_data_one[0]["event_Authors"]
        print("here are the first Authors")
        print(first_event_Authors)
        # ORM query to update
        conference_event_obj_two = Event.nodes.filter(
            conference_event_name_abbr=second_event)
        models_data_two = compConfUtils.get_TotalSharedAuthors_between_conferences(
            conference_event_obj_two)
        second_event_Author = models_data_two[0]["event_Authors"]
        Authors_intersect_second_event = [
            value for value in first_event_Authors if value in second_event_Author]
        for AuthorIDs in Authors_intersect_second_event:
            # print("Author ID issss ")
            # print(AuthorIDs)
            idString = ""
            idString = AuthorIDs[0]
            # print("Author ID string ")
            print("string: ", idString)
            # ORM query to update
            one_event_authors_name = list(set(
                [author.author_name for author in Author.nodes.filter(semantic_scolar_author_id=AuthorIDs)]))
            # print("Author Name issss ")
            print("one_event_authors_name: ", one_event_authors_name)
            sharedAuthorsFinal.append(one_event_authors_name[0])

        for firstAuthors in first_event_Authors:
            # print("Author ID issss ")
            # print(firstAuthors)
            idString = ""
            idString = firstAuthors[0]
            # print("Author ID string ")
            # print(idString)
            # ORM query to update
            one_event_authors_name = list(set(
                [author.author_name for author in Author.nodes.filter(semantic_scolar_author_id=firstAuthors)]))
            # print("Author Name issss ")
            # print(one_event_authors_name)
            firstAuthorsFinal.append(one_event_authors_name[0])

        for secondAuthors in second_event_Author:
            # print("Author ID issss ")
            # print(secondAuthors)
            idString = ""
            idString = secondAuthors[0]
            # print("Author ID string ")
            # print(idString)
            # ORM query to update
            one_event_authors_name = list(set(
                [author.author_name for author in Author.nodes.filter(semantic_scolar_author_id=secondAuthors)]))
            print("Author Name issss ")
            secondAuthorsFinal.append(one_event_authors_name[0])

        print("Author final issss ")
        print(sharedAuthorsFinal)
        print("firstAuthorsFinal issss ")
        print(firstAuthorsFinal)
        print("secondAuthorsFinal issss ")
        print(secondAuthorsFinal)

        print("Shaaaareeeed Authors")
        print(Authors_intersect_second_event)

        # for model_data in models_data:
        #     events_name_list.append(model_data['conference_event_abbr'])

        # for event in events_name_list:
        #     for data in models_data:
        #         ocurrence_list = list(filter(lambda inner_data: inner_data['conference_event_abbr'] == event, data))
        #         if ocurrence_list:
        #             sum_sharedAuthors = []
        #             sum_sharedAuthors += result['event_Authors']
        #             for result in ocurrence_list:
        #                 sum_sharedAuthors += result['event_Authors']
        #             no_SharedAuthor.append(sum_sharedAuthors)
        #             sum_sharedAuthors = []
        #         else:
        #             sum_sharedAuthors = []
        #             no_SharedAuthor.append(sum_sharedAuthors)
        #     no_SharedAuthor = set.intersection(*map(set,no_SharedAuthor))

        ctx = confutils.generate_venn_photo(
            firstAuthorsFinal[0:10], secondAuthorsFinal[0:10], sharedAuthorsFinal[0:10], first_event, second_event, keyword_or_topic)

        return Response({
            "commontopics": ctx
        })


class AuthorEvents(APIView):
    def get(self, request, *args, **kwargs):
        first_event_Authors = []
        firstAuthorsFinal = []
        EventAuthorsFinal = []
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        first_event = url_splits[-1]
        print("here are the two events")
        print(first_event)
        conference_event_obj_one = Event.nodes.filter(
            conference_event_name_abbr=first_event)
        models_data_one = compConfUtils.get_TotalSharedAuthors_between_conferences(
            conference_event_obj_one)
        first_event_Authors = models_data_one[0]["event_Authors"]
        print("here are the first Authors")
        print(first_event_Authors)

        for firstAuthors in first_event_Authors:

            print(firstAuthors)
            idString = ""
            idString = firstAuthors[0]
            one_event_authors_name = list(set(
                [author.author_name for author in Author.nodes.filter(
                    semantic_scolar_author_id=firstAuthors)]))
            print(one_event_authors_name)
            firstAuthorsFinal.append(one_event_authors_name[0])

        for Authors in firstAuthorsFinal:
            EventAuthorsFinal.append({
                'value': Authors,
                'label': Authors,
            })
        return Response({
            "EventAuthors": EventAuthorsFinal
        })


class AuthorInterestsBar(APIView):
    def get(self, request, *args, **kwargs):
        result_data = []
        url_splits = confutils.split_restapi_url(request.get_full_path(), r'/')
        second_author = url_splits[-1]
        first_author = url_splits[-2]
        keyword_or_topic = url_splits[-3]
        second_event = url_splits[-4]
        first_event = url_splits[-5]

        first_author_obj = Author.nodes.get(author_name=first_author)
        second_author_obj = Author.nodes.get(author_name=second_author)

        # get_author_publications_in_conf fathy's code
        first_author_publications = confutils.get_author_publications_in_conf(
            first_author_obj.semantic_scolar_author_id, "", first_event)

        second_author_publications = confutils.get_author_publications_in_conf(
            second_author_obj.semantic_scolar_author_id, "", second_event)
        
        # there are two function with the same name get_author_interests 
        # fathy's code  and old one which I use now
        #  I got it from Abdalla's code bacause the one that fathy implemented doesn't work
        first_author_interests = compConfUtils.get_author_interests(
            first_author_publications, "", keyword_or_topic)
        
        sorted_data_first_author = dict(
            sorted(first_author_interests.items(), key=lambda item: item[1], reverse=True))
        print("Author interestsssssssss")
        print(first_author_interests)
        
        reduced_sorted_data_first_author = dict(
            itertools.islice(sorted_data_first_author.items(), 10))
        print("first Author interestsssssssss")
        print(reduced_sorted_data_first_author)

        # get_author_interests fathy's code
        second_author_interests = compConfUtils.get_author_interests(
            second_author_publications, "", keyword_or_topic)
        sorted_data_second_author = dict(
            sorted(second_author_interests.items(), key=lambda item: item[1], reverse=True))
        reduced_sorted_data_second_author = dict(
            itertools.islice(sorted_data_second_author.items(), 10))
        print("second Author interestsssssssss")
        print(reduced_sorted_data_second_author)

        authors_dict = {
            k: [reduced_sorted_data_first_author.get(k, 0),
                reduced_sorted_data_second_author.get(k, 0)]
            for k in reduced_sorted_data_first_author.keys() | reduced_sorted_data_second_author.keys()
        }
        print("Author dictttttttttttttt")
        print(authors_dict)

        set_intersect_key = list(
            set(reduced_sorted_data_first_author.keys()).intersection(set(reduced_sorted_data_second_author.keys())))

        words = authors_dict.keys()
        weights = authors_dict.values()
        authors_name = [first_author, second_author]
        print(set_intersect_key, '-----------', words, '+++++++++',
              weights, '++++++++', authors_name, '------------')

        result_data.append(words)
        result_data.append(weights)
        result_data.append(authors_name)
        result_data.append(set_intersect_key)

        print('######################## HERE #########################')
        print(authors_dict)
        print('######################## HERE #########################')

        print(dict(itertools.islice(sorted_data_first_author.items(), 10)))
        print('############')
        print(dict(itertools.islice(sorted_data_second_author.items(), 10)))

        return Response({
            "authorInterests": result_data})
