from conferences import conference_utils as confutils
from conferences.models.conference import Conference as graphConference
from conferences.models.author import Author
from conferences.models.event import Event
from neomodel import match, Traversal
import re


def get_years_range_of_conferences(conferences_list, all_or_shared):
    """determines the year range of a given list of conferences, either all the years or only the shared years

    Args:
        conferences_list (list): list of conference names
        all_or_shared (str): "all" or "shared"

    Returns:
        list: list of the years range of the given conferences
    """

    years = []
    result_data = []
    years_filtering_list = []
    years_filtering_list = []

    for conference in conferences_list:
        # neomodel query review and works
        conference_obj = graphConference.nodes.get_or_none(
            conference_name_abbr=conference)
        # neomodel query review and works
        conference_event_objs = Event.nodes.filter(
            conference_event_name_abbr__startswith=conference_obj.conference_name_abbr)

        for obj in conference_event_objs:
            print("conference_event_obj", obj)
        intermediate_list = []
        for conference_event_obj in conference_event_objs:
            confernece_year = re.sub("[^0-9]", "",
                                     conference_event_obj.conference_event_name_abbr.split('-')[0])
            if re.match("^\d{2}$", confernece_year):
                confernece_year = '19' + confernece_year
            intermediate_list.append(confernece_year)
        years.append(intermediate_list)

    if all_or_shared == 'shared':
        for years_list in years:
            years_list = list(set(years_list))
            years_filtering_list.append(years_list)
        years_filtering_list = [y for x in years_filtering_list for y in x]
        result_data = list(set([year for year in years_filtering_list
                                if years_filtering_list.count(year) == len(conferences_list)]))
    elif all_or_shared == 'all':
        result_data = sorted(list(set().union(*years)))

    print('#################### result_data ######################')
    print(result_data)
    print('#################### result_data ######################')

    return result_data


def get_TotalSharedAuthors_between_conferences(conference_event_objs):
    result_data = []
    for conference_event in conference_event_objs:
        one_event_authors = []
        no_of_event_authors = 0
        # neomodel query
        # reviewed and works
        check_exist = Event.nodes.get_or_none(
            conference_event_name_abbr=conference_event
            .conference_event_name_abbr)
        if check_exist and check_exist.authors is not None and len(check_exist.authors) is not 0:
            one_event_authors = list(set([author.semantic_scolar_author_id for author in Event.nodes.filter(
                conference_event_name_abbr=conference_event.conference_event_name_abbr).authors.all()]))
            no_of_event_authors = len(one_event_authors)
            result_data.append({
                'no_AuthorPaper': no_of_event_authors,
                'conference_event_abbr': conference_event.conference_event_name_abbr,
                'event_Authors': one_event_authors,
                'year': re.sub("[^0-9]", "",
                               conference_event.conference_event_name_abbr.split('-')[0])
            })
        else:
            result_data.append({
                'no_AuthorPaper': no_of_event_authors,
                'conference_event_abbr': conference_event.conference_event_name_abbr,
                'event_Authors': one_event_authors,
                'year': re.sub("[^0-9]",
                               "", conference_event.conference_event_name_abbr.split('-')[0])
            })
    print('############## Weights #################')
    print(result_data)
    print('############## Weights #################')

    return result_data


def get_shared_words_numbers(conference_events_list, keyword_or_topic):
    """retieves shared topics/keywords number between different conference events

    Args:
        conference_events_list (list): list of conference event names
        keyword_or_topic (str): "topic" or "keyword"

    Returns:
        int: shared words number between list of events
    """

    shared_words = []
    conference_event_data = []
    all_words = []
    for conference_event in conference_events_list:
        if keyword_or_topic == 'topic':
            conference_event_data = confutils.get_topics_from_models(
                conference_event)
        elif keyword_or_topic == 'keyword':
            conference_event_data = confutils.get_keywords_from_models(
                conference_event)

        for data in conference_event_data:
            # {'topic': 'Learners', 'weight': 9, 'event': 'aied2017'}
            all_words.append(data[keyword_or_topic])

    shared_words = list(set([word for word in all_words if all_words.count(
        word) == len(conference_events_list)]))
    print("here is the newwwww corona testtttt")
    noOfSharedword = len(shared_words)
    print(noOfSharedword)

    return noOfSharedword


def get_top_words_in_years(list_of_events, keyword_or_topic):
    """extracts keywords and topics over a long period of years

    Args:
        conference_event_name_abbr (str): the name of the conference

    """
    list_of_final_words = {}
    models_data_total = []
    print("here are the coming list")
    print(list_of_events)
    print("here are the coming list")

    if keyword_or_topic == "keyword":
        for conference_event_name_abbr in list_of_events:
            models_data = confutils.get_keywords_from_models(
                conference_event_name_abbr)
            models_data_total.append(models_data)
    if keyword_or_topic == "topic":
        for conference_event_name_abbr in list_of_events:
            models_data = confutils.get_topics_from_models(
                conference_event_name_abbr)
            models_data_total.append(models_data)

    count = 0
    for event in list_of_events:
        print("here are some important test")
        print(event)
        for model in models_data_total[count]:
            print("here are some important test 22")
            print(count)
            print(model)
            print("here are some important test 222")
            if model[keyword_or_topic] in list_of_final_words.keys():
                list_of_final_words[model[keyword_or_topic]] += model['weight']
            else:
                list_of_final_words[model[keyword_or_topic]] = model['weight']
        count += 1

    print("here are the modeldataaa from db")
    print(list_of_final_words)
    sorted_list_of_final_words = {k: v for k, v in sorted(
        list_of_final_words.items(), key=lambda item: item[1])}
    print(sorted_list_of_final_words)
    print("here are the modeldataaa from db")

    return sorted_list_of_final_words
