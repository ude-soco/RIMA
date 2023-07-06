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


def get_event_publications_keywordsTopics(keyword_or_topic, event):
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
    print("final data: ", final_data)
    return final_data


def get_relavant_pubsCount__keywordTopic_conf_based(
        conf_name, keyword_or_topic, number_of_keyphrase, no_of_top_Kyphras):

    all_event = get_conf_events(conf_name)

    events_Pubs_keywords = get_all_keywordsOrTopic_of_Event_Publications(
        keyword_or_topic, all_event, number_of_keyphrase)

    top_keyphrase = get_top_popular_keyphrase(
        events_Pubs_keywords, no_of_top_Kyphras)

    events_Pubs_keywords = filter_event_pubs_keyword_basedOn_topKeyphrase(
        events_Pubs_keywords, top_keyphrase)

    return events_Pubs_keywords


def get_publication_count_for_Multi_events(
        eventsList, Keyword_or_topic, number_of_keyphrase, shared_keyphrase):

    events_nodes = get_eventsNode_for_eventsname(eventsList)

    events_Pubs_keywords = get_all_keywordsOrTopic_of_Event_Publications(
        Keyword_or_topic, events_nodes, number_of_keyphrase)
    if (shared_keyphrase == "true"):
        events_Pubs_keywords = get_shared_between_keyphrase(
            events_Pubs_keywords)

    return events_Pubs_keywords


def get_shared_between_keyphrase(events_Pubs_keywords):
    if (len(events_Pubs_keywords) == 1):
        return events_Pubs_keywords
    else:
        final_results = []
        keywords = [item["keywords"]
                    for item in events_Pubs_keywords]
        sets = [set(item["name"] for item in subset) for subset in keywords]
        shared_Keyphrase = set.intersection(*sets)

        print("shared_Keyphrase", shared_Keyphrase)
        for item in events_Pubs_keywords:
            year = item["year"]
            Event_keywords = item["keywords"]
            final_kewords = [
                event_keyword for event_keyword in Event_keywords if event_keyword["name"] in shared_Keyphrase]
            final_results.append({
                "year": year,
                "keywords": final_kewords
            })

        print("final results: ", final_results)
        return final_results


def get_Top_Keyphrase_In_Conf(
        conf_name, keyword_or_topic, number_of_keyphrase, no_of_top_Kyphras):

    all_event = get_conf_events(conf_name)

    events_Pubs_keywords = get_all_keywordsOrTopic_of_Event_Publications(
        keyword_or_topic, all_event, number_of_keyphrase)

    top_keyphrase = get_top_popular_keyphrase(
        events_Pubs_keywords, no_of_top_Kyphras)

    return top_keyphrase


def get_all_keywordsOrTopic_of_Event_Publications(
        keyword_or_topic, all_event, number_of_keyphrase):
    events_keywordsOrTopic = []
    for event in all_event:
        pubs_keywordsTopics = get_event_publications_keywordsTopics(
            keyword_or_topic, event)
        counter = Counter(pubs_keywordsTopics)
        result = [{'name': key, 'count': value}
                  for key, value in counter.items()]
        result = sorted(result, key=lambda x: x['count'], reverse=True)
        print("number_of_keyphrasenumber_of_keyphrase", number_of_keyphrase)
        result = result[:number_of_keyphrase] if number_of_keyphrase != "all" else result

        events_keywordsOrTopic.append({
            "year": re.sub(
                "[^0-9]", "", event.conference_event_name_abbr),
            "keywords": result

        })

    return events_keywordsOrTopic


def filter_event_pubs_keyword_basedOn_topKeyphrase(eventsKeyPhrase, topKeyphrase):
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
    conference_event_objs = Event.nodes.filter(
        conference_event_name_abbr__startswith=conf_name)
    return conference_event_objs


def get_relavant_publication(even_name, keyword_or_topic, keywordTopic_name):

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


def get_eventsNode_for_eventsname(events_names):
    events_nodes = []
    print("Event: ", events_names)
    for event in events_names:
        event_node = Event.nodes.filter(conference_event_name_abbr=event)
        if (event_node is not None):
            events_nodes.extend(event_node)

    return events_nodes


def get_events_TopicsOrKeywords(Keyword_topics, events):
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


def get_shared_keywordsOrTopics_basedOn_combs(events_keywords, all_combs):
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
        print("names: ", names)
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
    print("***********************************************************")
    print("shared_keywords_combs: ", final_sets)
    print("******************************************************")
    print(": ", authors_name)
    result.append(final_sets)
    result.append(authors_name)

    return result


def get_shared_between_events_combs(shared_based, events):
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
