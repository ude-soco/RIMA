# implemented by Islam Abdelghaffar
from conferences import conference_utils as confutils
from conferences.models.graph_db_entities import Conference as graphConference
from conferences.models.graph_db_entities import *
from neomodel import match, Traversal
import re
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from neomodel import *
from itertools import combinations
import numpy as np
from collections import Counter
from conferences.utils import compare_conferences_utils as compConfUtils
from collections import defaultdict


def get_event_publications_keywords_topics(keyword_or_topic, event):
    """
    The function "get_event_publications_keywords_topics" returns a list of keywords or topics associated with the publications of a given event.

    :param keyword_or_topic: The parameter "keyword_or_topic" is a string that specifies whether the function should retrieve keywords or topics. It can have two possible values: "keyword" or "topic"
    :param event: The "event" parameter is an object representing an event. It likely has a property called "publications" which is a collection of publications related to the event. Each publication may have a collection of keywords associated with it
    :return: a list of keywords or topics associated with the publications of a given event.
    """
    pubs_keywordsTopics = []
    event_pubs = event.publications.all()
    for pub in event_pubs:
        keywords = [keyword.keyword for keyword in pub.keywords.all()]
        if (keyword_or_topic == "keyword"):
            pubs_keywordsTopics.extend(keywords)
        elif (keyword_or_topic == "topic"):
            pubs_keywordsTopics.extend(keywords)
    return pubs_keywordsTopics


def convert_data_to_barChart_sets(data):
    """
    The function `convert_data_to_barChart_sets` takes in a list of data containing keyword counts for different years and converts it into a format suitable for creating a bar chart.

    :param data: The `data` parameter is a list of dictionaries. Each dictionary represents data for a specific year and contains two keys: 'year' and 'keywords'
    :return: a list of dictionaries, where each dictionary represents a keyword and its corresponding data in the form of a list of counts.
    """
    all_keywords = set()
    for year_data in data:
        for keyword_data in year_data['keywords']:
            all_keywords.add(keyword_data['name'])

    keyword_counts = {keyword: [0] * len(data) for keyword in all_keywords}

    for i, year_data in enumerate(data):
        year_keywords = {k['name']: k['count'] for k in year_data['keywords']}
        for keyword in all_keywords:
            if keyword in year_keywords:
                keyword_counts[keyword][i] = year_keywords[keyword]

    final_data = []
    for keyword, counts in keyword_counts.items():
        final_data.append({'name': keyword, 'data': counts})
    return final_data


def get_relavant_pubs_Count__keyword_topic_conf_based(conf_name, keyword_or_topic, number_of_keyphrase, no_of_top_Kyphras):
    """
    The function `get_relavant_pubs_Count__keyword_topic_conf_based` retrieves relevant publications based on a conference name, keyword or topic, and specified parameters.

    :param conf_name: The name of the conference you want to retrieve relevant publications for
    :param keyword_or_topic: The parameter "keyword_or_topic" is used to specify whether you want to search for publications based on a keyword or a topic
    :param number_of_keyphrase: The parameter "number_of_keyphrase" is the number of keyphrases or keywords you want to consider for filtering the event publications
    :param no_of_top_Kyphras: The parameter "no_of_top_Kyphras" represents the number of top keyphrases that you want to consider
    :return: the filtered event publications based on the top keyphrases.
    """

    all_event = get_conf_events(conf_name)

    events_Pubs_keywords = get_all_keywords_topics_of_event_publications(
        keyword_or_topic, all_event, number_of_keyphrase)

    top_keyphrase = get_top_popular_keyphrase(
        events_Pubs_keywords, no_of_top_Kyphras)

    events_Pubs_keywords = filter_event_pubs_keyword_based_on_topKeyphrase(
        events_Pubs_keywords, top_keyphrase)

    return events_Pubs_keywords


def get_publication_count_for_multi_events(eventsList, Keyword_or_topic, number_of_keyphrase, shared_keyphrase):
    """
    The function `get_publication_count_for_multi_events` takes a list of events, a keyword or topic, the number of keyphrases, and a flag indicating whether to consider shared keyphrases, and returns the publication count for each event based on the given criteria.

    :param eventsList: A list of events. Each event can be represented as a string
    :param Keyword_or_topic: This parameter represents the keyword or topic that you want to search for in the event publications. It is used to filter the publications based on the specified keyword or topic
    :param number_of_keyphrase: The parameter "number_of_keyphrase" is the number of keywords or topics you want to retrieve for each event publication
    :param shared_keyphrase: The parameter "shared_keyphrase" is a boolean value that determines whether the returned publication count should include only publications that have all the specified keywords/topics in common (shared_keyphrase=True) or publications that have any of the specified keywords/topics (shared_keyphrase=False)
    :return: the publication count for multiple events based on a given keyword or topic.
    """

    events_nodes = get_events_Node_for_events_name(eventsList)

    events_Pubs_keywords = get_all_keywords_topics_of_event_publications(
        Keyword_or_topic, events_nodes, number_of_keyphrase)
    if (shared_keyphrase == "true"):
        events_Pubs_keywords = get_shared_between_keyphrase(
            events_Pubs_keywords)

    return events_Pubs_keywords


def get_shared_between_keyphrase(events_Pubs_keywords):
    """
    The function `get_shared_between_keyphrase` takes a list of dictionaries containing events and their associated keywords, and returns a new list of dictionaries where each dictionary contains the year and only the keywords that are shared between all events.

    :param events_Pubs_keywords: The parameter `events_Pubs_keywords` is expected to be a list of dictionaries. Each dictionary represents an event or publication and contains the following keys:
    :return: a list of dictionaries, where each dictionary represents an event or publication. Each dictionary contains the year and a list of keywords that are shared between all events or publications.
    """
    if (len(events_Pubs_keywords) == 1):
        return events_Pubs_keywords
    else:
        final_results = []
        keywords = [item["keywords"]
                    for item in events_Pubs_keywords]
        sets = [set(item["name"] for item in subset) for subset in keywords]
        shared_Keyphrase = set.intersection(*sets)

        for item in events_Pubs_keywords:
            year = item["year"]
            Event_keywords = item["keywords"]
            final_kewords = [
                event_keyword for event_keyword in Event_keywords if event_keyword["name"] in shared_Keyphrase]
            final_results.append({
                "year": year,
                "keywords": final_kewords
            })

        return final_results


def get_Top_Keyphrase_In_conf(conf_name, keyword_or_topic, number_of_keyphrase, no_of_top_Kyphras):
    """
    The function `get_Top_Keyphrase_In_conf` takes in a conference name, a keyword or topic, the number of keyphrases to retrieve, and the number of top keyphrases to return, and returns the top keyphrases based on popularity in the conference.

    :param conf_name: The name of the conference
    :param keyword_or_topic: The parameter "keyword_or_topic" is used to specify whether you want to retrieve keyphrases based on a specific keyword or a topic. You can pass either a keyword or a topic as a string to this parameter
    :param number_of_keyphrase: The number of keyphrases to retrieve for each event publication
    :param no_of_top_Kyphras: The parameter "no_of_top_Kyphras" represents the number of top keyphrases you want to retrieve
    :return: the top keyphrases based on the specified conference name, keyword or topic, number of keyphrases, and number of top keyphrases.
    """

    all_event = get_conf_events(conf_name)

    events_Pubs_keywords = get_all_keywords_topics_of_event_publications(
        keyword_or_topic, all_event, number_of_keyphrase)

    top_keyphrase = get_top_popular_keyphrase(
        events_Pubs_keywords, no_of_top_Kyphras)

    return top_keyphrase


def get_all_keywords_topics_of_event_publications(keyword_or_topic, all_event, number_of_keyphrase):
    """
    The function `get_all_keywords_topics_of_event_publications` retrieves the keywords or topics of event publications, counts their occurrences, and returns the top N keyphrases for each event.

    :param keyword_or_topic: The keyword or topic you want to search for in the event publications
    :param all_event: A list of all events
    :param number_of_keyphrase: The parameter "number_of_keyphrase" specifies the maximum number of keywords or topics to be returned for each event. If the value is "all", then all keywords or topics will be returned
    :return: a list of dictionaries, where each dictionary represents an event and its corresponding keywords or topics. Each dictionary contains the year of the event and a list of keywords or topics along with their respective counts.
    """
    events_keywordsOrTopic = []
    for event in all_event:
        pubs_keywordsTopics = get_event_publications_keywords_topics(
            keyword_or_topic, event)
        counter = Counter(pubs_keywordsTopics)
        result = [{'name': key, 'count': value}
                  for key, value in counter.items()]
        result = sorted(result, key=lambda x: x['count'], reverse=True)
        result = result[:number_of_keyphrase] if number_of_keyphrase != "all" else result

        events_keywordsOrTopic.append({
            "year": re.sub(
                "[^0-9]", "", event.conference_event_name_abbr),
            "keywords": result

        })

    return events_keywordsOrTopic


def filter_event_pubs_keyword_based_on_topKeyphrase(eventsKeyPhrase, topKeyphrase):
    """
    The function filters a list of events based on a set of top keywords, returning only the events that have at least one keyword from the top keywords set.

    :param eventsKeyPhrase: A list of dictionaries, where each dictionary represents an event and contains two keys: "year" (an integer representing the year of the event) and "keywords" (a list of dictionaries representing keywords associated with the event)
    :param topKeyphrase: A list of tuples where each tuple contains a keyword and its frequency. The keywords are the top keywords based on their frequency
    :return: a list of dictionaries, where each dictionary represents an event publication. Each dictionary contains the year of the event publication and a list of common keywords that match the top keyphrases provided.
    """
    final_result = []
    top_keys = set([item[0] for item in topKeyphrase])

    for item in eventsKeyPhrase:
        year = item["year"]
        Keywords = item["keywords"]
        common_keywords = []
        for keyword in Keywords:
            if keyword.get("name") in top_keys:

                common_keywords.append(keyword)

        final_result.append({
            "year": year,
            "keywords": common_keywords
        })

    return final_result


def get_top_popular_keyphrase(eventsKeyphrase, numberTopKeyphrase):
    """
    The function `get_top_popular_keyphrase` takes a list of events with keyphrases and returns the top `numberTopKeyphrase` keyphrases based on their popularity.

    :param eventsKeyphrase: A list of dictionaries representing events, where each event has a "keywords" key that contains a list of dictionaries representing keywords. Each keyword dictionary has a "name" key representing the name of the keyword and a "count" key representing the count of that keyword
    :param numberTopKeyphrase: The number of top keyphrases you want to retrieve
    :return: a list of the top `numberTopKeyphrase` keyphrases based on their popularity. Each keyphrase is represented as a tuple containing the keyphrase name and its popularity count.
    """
    dict_list_1 = [{item["name"]: item["count"]
                    for item in event['keywords'] if item["count"] > 1}
                   for event in eventsKeyphrase]

    sum_dict = defaultdict(lambda: {"sum": 0, "count": 0})
    for item in dict_list_1:
        for key, value in item.items():
            sum_dict[key]["sum"] += value
            sum_dict[key]["count"] += 1

    average_dict = {key: value['sum']
                    for key, value in sum_dict.items()}

    average_dict = dict(sorted(average_dict.items(),
                               key=lambda item: item[1], reverse=True))
    top_5 = list(average_dict.items())[:numberTopKeyphrase]

    return top_5


def get_conf_events(conf_name):
    """
    The function `get_conf_events` retrieves conference event objects based on a given conference name abbreviation.

    :param conf_name: The `conf_name` parameter is a string that represents the abbreviation or prefix of a conference event name
    :return: a list of conference event objects that have a name abbreviation starting with the given conference name.
    """
    conference_event_objs = Event.nodes.filter(
        conference_event_name_abbr__startswith=conf_name)
    return conference_event_objs


def get_relavant_publication(even_name, keyword_or_topic, keywordTopic_name):
    """
    The function `get_relavant_publication` filters a list of publications based on a given event name, keyword or topic, and keyword or topic name.

    :param even_name: The abbreviation or name of the conference event
    :param keyword_or_topic: The parameter "keyword_or_topic" is used to determine whether the search should be based on a keyword or a topic. It can have two possible values: "keyword" or "topic"
    :param keywordTopic_name: The keyword or topic name that you want to search for in the publications
    :return: a list of relevant publications based on the given event name, keyword or topic, and keyword or topic name.
    """

    event_obj_publications = Event.nodes.filter(
        conference_event_name_abbr=even_name).publications.all()
    if keyword_or_topic == "keyword":
        publicationsList = [
            pub for pub in event_obj_publications
            if pub.keywords.filter(keyword=keywordTopic_name)
        ]
        return publicationsList

    elif keyword_or_topic == "topic":
        publicationsList = [
            pub for pub in event_obj_publications
            if pub.topics.filter(topics=keywordTopic_name)
        ]
        return publicationsList


def get_events_Node_for_events_name(events_names):
    """
    The function `get_events_Node_for_events_name` takes a list of event names and returns a list of event nodes that match those names.

    :param events_names: The parameter `events_names` is a list of event names
    :return: a list of event nodes that match the given event names.
    """
    events_nodes = []
    for event in events_names:
        event_node = Event.nodes.filter(conference_event_name_abbr=event)
        if (event_node is not None):
            events_nodes.extend(event_node)

    return events_nodes


def get_events_topics_or_keywords(Keyword_topics, events):
    """
    The function `get_events_topics_or_keywords` takes in a parameter `Keyword_topics` and a list of `events`, and returns a list of dictionaries containing the event name and its associated keywords if `Keyword_topics` is set to "keyword".

    :param Keyword_topics: A string indicating whether the search should be based on "topics" or "keywords"
    :param events: A list of events. Each event is represented as a string
    :return: a list of dictionaries. Each dictionary contains the event name and a list of keywords associated with that event.
    """
    results = []
    for event in events:
        if (Keyword_topics == "keyword"):
            event_keywords = Event.nodes.get(
                conference_event_name_abbr=event).keywords.all()
            results.append({
                "event_name": event,
                "keywords": [Keyword.keyword for Keyword in event_keywords]
            })

    return results


def get_shared_keywords_or_topics_based_on_combs(events_keywords, all_combs):
    """
    The function `get_shared_keywords_or_topics_based_on_combs` takes in a list of events' keywords and a list of combinations of events, and returns a list of shared keywords or topics between the events in each combination, along with the corresponding authors' names.

    :param events_keywords: The parameter "events_keywords" is a list of dictionaries. Each dictionary represents an event and contains the following keys:
    :param all_combs: The parameter "all_combs" is a list of lists. Each inner list represents a combination of events. Each event is represented by its name
    :return: a list containing two elements. The first element is a list of sets, where each set represents a combination of events and their shared keywords or topics. Each set contains the names of the events, the value of the shared keywords or topics, and a combined name for the events. The second element is a list of dictionaries, where each dictionary represents a combination of events and their shared
    """
    result = []
    final_sets = []
    authors_name = []
    for comb in all_combs:
        sets = []
        relevant_confs = []
        for event in comb:
            relevant_conf = [
                item for item in events_keywords if item["event_name"] == event]
            relevant_confs.append(relevant_conf)
        shared_keywordsOrTopics_combs = get_shared_between_events_combs(
            shared_based="keywords",
            events=relevant_confs)

        names = sorted(shared_keywordsOrTopics_combs[0]["name"])
        value = shared_keywordsOrTopics_combs[0]["data"]
        if value != 0:
            sets.append({
                "sets": names,
                "value": value,
                "name": " and ".join(names)
            })
            final_sets.extend(
                sets
            )
            authors_name.append({
                "name": " and ".join(names),
                "keywords": shared_keywordsOrTopics_combs[0]["keywords"]
            })

    result.append(final_sets)
    result.append(authors_name)

    return result


def get_shared_between_events_combs(shared_based, events):
    """
    The function `get_shared_between_events_combs` takes a list of events and a shared attribute as input, and returns a list of dictionaries containing the names of the events, the number of common elements in the shared attribute, and the common elements themselves.

    :param shared_based: The parameter "shared_based" is a string that specifies the key in the event objects that contains the shared information. This key is used to extract the shared information from each event object
    :param events: The "events" parameter is a list of dictionaries. Each dictionary represents an event and contains information about the event, such as the event name and keywords or topics associated with the event
    :return: a list containing a dictionary. The dictionary has three key-value pairs: "name", "data", and "keywords". The "name" key maps to a list of event names, the "data" key maps to the number of common keywords or topics between the events, and the "keywords" key maps to a list of the common keywords or topics.
    """
    final = []
    events_name = []
    events_KeywordsOrTopics_list = []
    for event in events:
        for obj in event:
            events_name.append((obj["event_name"]))
            events_KeywordsOrTopics_list.append(obj[shared_based])
    common_keywordsOrTopics = compConfUtils.common_elements_in_set(
        events_KeywordsOrTopics_list)
    final.append({
        "name": events_name,
        "data": len(common_keywordsOrTopics),
        "keywords": [author for author in common_keywordsOrTopics]
    })
    return final
