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
        # neomodel query review and works islam updated
        conference_obj = graphConference.nodes.get_or_none(
            conference_name_abbr=conference)
        # neomodel query review and works  islam updated
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

# done


def get_TotalSharedAuthors_between_conferences(conference_event_objs):
    result_data = []
    for conference_event in conference_event_objs:
        one_event_authors = []
        no_of_event_authors = 0
        # neomodel query  islam updated
        # reviewed and works
        event_obj = Event.nodes.get_or_none(
            conference_event_name_abbr=conference_event
            .conference_event_name_abbr)
        # islam updated
        if event_obj and event_obj.authors is not None and len(event_obj.authors) is not 0:
            one_event_authors = list(
                set([author.semantic_scolar_author_id for author in event_obj.authors.all()]))
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
            # islam updated
            conference_event_data = get_topics_from_models(
                conference_event)
        elif keyword_or_topic == 'keyword':
            # islam updated
            conference_event_data = get_keywords_from_models(
                conference_event)

        for data in conference_event_data:
            # {'topic': 'Learners', 'weight': 9, 'event': 'aied2017'}
            all_words.append(data[keyword_or_topic])
    print("all_words:", all_words)
    shared_words = list(set([word for word in all_words if all_words.count(
        word) == len(conference_events_list)]))
    print("here is the newwwww corona testtttt")
    noOfSharedword = len(shared_words)
    print(noOfSharedword)

    return noOfSharedword


def get_topics_from_models(conference_event_name_abbr):
    """retrieves topics events based  and weights from topics tables

    Args:
        conference_event_name_abbr (str): the name of the conference event

    Returns:
        list: sorted list of dictionaries of topics and their weights and conference event
    """

    data = []
    # islam updated
    event_obj = Event.nodes.get(
        conference_event_name_abbr=conference_event_name_abbr)
    event_has_topic_objs = event_obj.topics.all()
    for event_has_topic_obj in event_has_topic_objs:
        has_topic_relationship = event_obj.topics.relationship(
            event_has_topic_obj)
        weight = has_topic_relationship.weight
        data.append({
            'topic': event_has_topic_obj.topic,
            'weight': weight,
            'event': event_obj.conference_event_name_abbr,
        })
    sorted_data = sorted(data, key=lambda k: k['weight'], reverse=True)
    return sorted_data


def get_keywords_from_models(conference_event_name_abbr):
    """retrieves keywords events based and weights from keywords tables

    Args:
        conference_event_name_abbr (str): the name of the conference event

    Returns:
        list: sorted list of dictionaries of keywords and their weights and conference event
    """

    data = []
    # islam updated
    event_obj = Event.nodes.get(
        conference_event_name_abbr=conference_event_name_abbr)
    # islam updated
    event_has_keyword_objs = event_obj.keywords.all()
    for event_has_keyword_obj in event_has_keyword_objs:
        # islam updated
        has_keyword_relationship = event_obj.keywords.relationship(
            event_has_keyword_obj)
        weight = has_keyword_relationship.weight
        data.append({
            'keyword': event_has_keyword_obj.keyword,
            'weight': weight,
            'event': event_obj.conference_event_name_abbr,
        })

    sorted_data = sorted(data, key=lambda k: k['weight'], reverse=True)
    return sorted_data


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
        # islam updated
        for conference_event_name_abbr in list_of_events:
            models_data = get_keywords_from_models(
                conference_event_name_abbr)
            models_data_total.append(models_data)
    if keyword_or_topic == "topic":
        # islam updated
        for conference_event_name_abbr in list_of_events:
            models_data = get_topics_from_models(
                conference_event_name_abbr)
            models_data_total.append(models_data)

    count = 0
    for event in list_of_events:
        print("event name: ", event)
        for model in models_data_total[count]:
            print("event keywords count: ", count)
            print("event keywords date: ", model)
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

# need to be updated and change getkey


def get_author_interests(publications_list, author_id, keyword_or_topic, num=30):
    """fetches authors keyword- and wiki-based interests from a papers list

    Args:
        publications_list (list): list of publication objects
        author_id (str): author semantic scholar ID
        keyword_or_topic (str): either keyword- or wiki-based interest
        num (int, optional): number of the words to be extracted. Defaults to 30.

    Returns:
        dict: dictionary of the extracted topics or keywords with their weights
    """

    abstract_title_str = ""
    keywords = {}
    topics = {}

    for publication in publications_list:
        if publication['title'] and publication['abstract']:
            abstract_title_str += publication['title'] + \
                " " + publication['abstract']

    if keyword_or_topic == 'keyword':
        keywords = getKeyword(abstract_title_str, 'Yake', num)
        return keywords

    elif keyword_or_topic == 'topic':

        keywords = getKeyword(abstract_title_str, 'Yake', num)
        relation, topics = wikifilter(keywords)

        return topics

    return ""

# Created by Islam , this fun is the updated of get_author_interests == extractor.getKey


def get_author_interests2(author_obj, event, keyword_or_topic):
    """fetches authors keyword- and wiki-based interests from a papers list

    Args:
        publications_list (list): list of publication objects
        author_id (str): author semantic scholar ID
        keyword_or_topic (str): either keyword- or wiki-based interest
        num (int, optional): number of the words to be extracted. Defaults to 30.

    Returns:
        dict: dictionary of the extracted topics or keywords with their weights
    """
    abstract_title_str = ""
    keywords = {}
    topics = {}

    if keyword_or_topic == 'keyword':
        author_event_keywords = []
        # islam Updated
        author_obj = Author.nodes.get(
            semantic_scolar_author_id=author_obj.semantic_scolar_author_id)
        author_keywords = author_obj.keywords.all()
        event_obj = Event.nodes.get(conference_event_name_abbr=event)
        event_keyword = event_obj.keywords.all()
        for author_keyword in author_keywords:
            if (author_keyword in event_keyword):
                author_event_keywords.append(author_keyword)

        for keyword in author_event_keywords:
            weight = (author_obj.keywords.relationship(keyword)).weight
            keywords[keyword.keyword] = weight

        return keywords

    elif keyword_or_topic == 'topic':
        author_event_topics = []
        # islam Updated
        author_obj = Author.nodes.get(
            semantic_scolar_author_id=author_obj.semantic_scolar_author_id)
        author_topics = author_obj.topics.all()
        event_obj = Event.nodes.get(conference_event_name_abbr=event)
        event_topics = event_obj.topics.all()
        for author_topic in author_topics:
            if (author_topic in event_topics):
                author_event_topics.append(author_topic)

        for topic in author_event_topics:
            weight = (author_obj.topics.relationship(topic)).weight
            topics[topic.topic] = weight

        return topics

    return ""


def get_AuthorPaper_weight_event_based(conference_event_objs, authorsOrPubs):
    """retrieves weights of a specific word in a list on conference events. If the word does not exist in an event, its weight is zero

    Args:
        conference_event_objs (list): list of conference event objects
        word (str): any topic or keyword
        authorsOrPubs (str): decides the type of the word --> "topic" or "keyword"

    Returns:
        list: list of data dictionaries of the weight of a word in every given conference event
    """

    result_data = []

    # islam Updated
    for conference_event in conference_event_objs:
        if authorsOrPubs == 'authorsEvolution':
            no_of_event_authors = 0
            one_event_authors = []
            # islam Updated
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
                    'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })
            else:
                result_data.append({
                    'no_AuthorPaper': no_of_event_authors,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'event_Authors': one_event_authors,
                    'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })

        elif authorsOrPubs == 'publicationsEvolution':
            # islam Updated
            check_exist = Event.nodes.get_or_none(
                conference_event_name_abbr=conference_event.conference_event_name_abbr)
            no_of_event_papers = ""
            one_event_authors = ""
            if check_exist:
                no_of_event_papers = len(Event.nodes.filter(
                    conference_event_name_abbr=conference_event.conference_event_name_abbr).publications.all())
                one_event_authors = list(set([author.semantic_scolar_author_id for author in Event.nodes.filter(
                    conference_event_name_abbr=conference_event.conference_event_name_abbr).authors.all()]))
                result_data.append({
                    'no_AuthorPaper': no_of_event_papers,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'event_Authors': one_event_authors,
                    'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })
            else:
                result_data.append({
                    'no_AuthorPaper': no_of_event_papers,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'event_Authors': one_event_authors,
                    'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })
    print('############## Weights #################')
    print(result_data)
    print('############## Weights #################')

    return result_data

# updated by islam


def get_word_weight_event_based(conference_event_objs, word, keyword_or_topic):
    """retrieves weights of a specific word in a list on conference events. If the word does not exist in an event, its weight is zero

    Args:
        conference_event_objs (list): list of conference event objects
        word (str): any topic or keyword
        keyword_or_topic (str): decides the type of the word --> "topic" or "keyword"

    Returns:
        list: list of data dictionaries of the weight of a word in every given conference event
    """

    result_data = []
    word_object = ""
    if keyword_or_topic == 'topic':
        # islam Updated
        word_object = Topic.nodes.filter(topic=word)
    elif keyword_or_topic == 'keyword':
        word_object = Keyword.nodes.filter(keyword=word)
    for conference_event in conference_event_objs:
        if keyword_or_topic == 'topic':
            event_obj = Event.nodes.get_or_none(
                conference_event_name_abbr=conference_event.conference_event_name_abbr)
            if (len(word_object) is not 0):
                has_topic_relationship = event_obj.topics.relationship(
                    word_object[0])
                if has_topic_relationship:
                    weight = has_topic_relationship.weight
                    result_data.append({
                        'word': word,
                        'conference_event_abbr': conference_event.conference_event_name_abbr,
                        'weight': weight,
                        'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                    })
                else:
                    result_data.append({
                        'word': word,
                        'conference_event_abbr': conference_event.conference_event_name_abbr,
                        'weight': 0,
                        'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                    })
            else:
                result_data.append({
                    'word': word,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'weight': 0,
                    'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })

        elif keyword_or_topic == 'keyword':
            # islam Updated
            event_obj = Event.nodes.get_or_none(
                conference_event_name_abbr=conference_event.conference_event_name_abbr)
            if (len(word_object) is not 0):
                has_topic_relationship = event_obj.keywords.relationship(
                    word_object[0])
                if has_topic_relationship:
                    weight = has_topic_relationship.weight
                    result_data.append({
                        'word': word,
                        'conference_event_abbr': conference_event.conference_event_name_abbr,
                        'weight': weight,
                        'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                    })
                else:
                    result_data.append({
                        'word': word,
                        'conference_event_abbr': conference_event.conference_event_name_abbr,
                        'weight': 0,
                        'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                    })

            else:
                result_data.append({
                    'word': word,
                    'conference_event_abbr': conference_event.conference_event_name_abbr,
                    'weight': 0,
                    'year': re.sub("[^0-9]", "", conference_event.conference_event_name_abbr.split('-')[0])
                })

    return result_data


def get_author_publications_in_conf(author_id, conference_name_abbr, conference_event_name_abbr=""):
    """retrieves all the pulication on an author from stored conferences

    Args:
        author_id (str): an author ID from table author
        conference_name_abbr (str): the name of the conference
        conference_event_name_abbr (str, optional): the name of the conference event. Defaults to "".

    Returns:
        list: sorted list of dictionaries. Conference event is the sort criterion
    """

    result_data = []
    author_has_papers_objs = []
    if conference_event_name_abbr == "":
        # islam Updated
        event_obj_publications = Event.nodes.filter(
            conference_event_name_abbr__startswith=conference_name_abbr)[0].publications.all()
        author_obj_published = Author.nodes.filter(
            semantic_scolar_author_id=author_id).published.all()
        for publication in author_obj_published:
            if (publication in event_obj_publications):
                author_has_papers_objs.append(publication)

    else:
        # islam Updated
        event_obj_publications = Event.nodes.filter(
            conference_event_name_abbr=conference_event_name_abbr).publications.all()
        author_obj_published = Author.nodes.filter(
            semantic_scolar_author_id=author_id).published.all()
        for publication in author_obj_published:
            if (publication in event_obj_publications):
                author_has_papers_objs.append(publication)

    for author_has_papers_obj in author_has_papers_objs:
        result_data.append({
            'semantic_scholar_paper_id': author_has_papers_obj.paper_id,
            'paper_doi': author_has_papers_obj.paper_doi,
            'title': author_has_papers_obj.title,
            'abstract': author_has_papers_obj.abstract,
            'semantic_scholar_url': author_has_papers_obj.urls,
            'conference_event': author_has_papers_obj.years,
        })

    return result_data


def get_event_papers_data(conference_event_name_abbr):
    """retrieves paper objects of a conference event

    Args:
        conference_event_name_abbr (str): the name of the conference event

    Returns:
        list: list of papers objects
    """
    conference_event_papers_data = []
    # islam Updated
    conference_event_obj = Event.nodes.get_or_none(
        conference_event_name_abbr=conference_event_name_abbr)
    if conference_event_obj is not None:
        conference_event_papers_data = conference_event_obj.publications.all()

    return conference_event_papers_data


def get_shared_words_between_events(conference_events_list, keyword_or_topic):
    """retieves shared words among given list of conference events

    Args:
        conference_events_list (list): list of conference event names
        keyword_or_topic (str): "topic" or "keyword"

    Returns:
        list: with two sub lists; shared words data and conference event names
    """

    shared_words = []
    shared_words_final_data = []
    result_data = []
    conference_event_data = []
    all_words = []

    for conference_event in conference_events_list:
        if keyword_or_topic == 'topic':
            # islam Updated
            conference_event_data = get_topics_from_models(conference_event)
        elif keyword_or_topic == 'keyword':
            conference_event_data = get_keywords_from_models(conference_event)

        for data in conference_event_data:
            all_words.append(data.get(keyword_or_topic))

    shared_words = list(set([word for word in all_words if all_words.count(
        word) == len(conference_events_list)]))

    for word in shared_words:
        words_weights = []
        for conference_event in conference_events_list:
            # islam Updated
            conference_event_obj = Event.nodes.get_or_none(
                conference_event_name_abbr=conference_event)
            conf_event_word_data = get_word_weight_event_based(
                [conference_event_obj], word, keyword_or_topic)
            words_weights.append(conf_event_word_data[0]['weight'])
        shared_words_final_data.append({
            'word': word,
            'weight': words_weights
        })

    result_data = [shared_words_final_data, conference_events_list]

    return result_data


def get_abstract_based_on_keyword(conference_event_name_abbr, keyword):
    """reteives paper data containing a specific word within an event
    Args:
        conference_event_name_abbr (str): the name of the conference event. For example, lak2020
        keyword (str): search word (topic or keyword)

    Returns:
        list: list of dictionaries of the found papers
    """
    # islam Updated
    filtered_conference_event_papers_data = []
    conference_event_papers_data = get_event_papers_data(
        conference_event_name_abbr)
    # filtered_conference_event_papers_data = Publication.nodes.filter(
    #     Q(abstract__icontains=keyword)
    #     | Q(title__icontains=keyword)).filter(paper_id__in=[p.paper_id for p in conference_event_papers_data])

    for publication in conference_event_papers_data:
        pubHasKeyword = publication.keywords.filter(keyword=keyword)
        if pubHasKeyword:
            filtered_conference_event_papers_data.append(publication)
            print("keyword: ", keyword, "pubHasKeyword: ", pubHasKeyword)

    # print('all papers: ', filtered_conference_event_papers_data)
    print('KEYWORD DATA *********************** ',
          filtered_conference_event_papers_data)

    titles_abstracts = []
    if filtered_conference_event_papers_data:
        for paper_data in filtered_conference_event_papers_data:
            if paper_data.title and paper_data.abstract:
                titles_abstracts.append({
                    'title': paper_data.title,
                    'abstarct': paper_data.abstract,
                    'year': paper_data.years,
                    'venue': paper_data.paper_venu,
                    'paper_id': paper_data.paper_id
                })

    # print("number of paper keeeeyword teeeest")
    # print(titles_abstracts)
    print("number of paper keeeeyword teeeest 2222")
    print(len(titles_abstracts))
    return titles_abstracts


def get_conf_total_authors(conf_name):
    authors_number = 0
    conf_node = Conference.nodes.filter(conference_name_abbr=conf_name)
    if conf_node:
        authors_number = len(conf_node.authors.all())
    return authors_number


def get_conf_total_publications(conf_name):
    publications_number = 0
    conf_node = Conference.nodes.filter(conference_name_abbr=conf_name)
    if conf_node:
        publications_number = len(conf_node.publication.all())
    return publications_number

# new func by Islam Abdelghaffar


def get_relavant_publication(event_list, keyword_or_topic, keywordTopic_name):
    publicationList = []
    for event in event_list:
        event_obj_publications = Event.nodes.filter(
            conference_event_name_abbr=event.strip()).publications.all()
        if keyword_or_topic == "keyword":
            pubs = [
                pub for pub in event_obj_publications
                if pub.keywords.filter(keyword=keywordTopic_name)
            ]
            publicationList.extend(pubs)

        elif keyword_or_topic == "topic":
            pubs = [
                pub for pub in event_obj_publications
                if pub.topics.filter(topics=keywordTopic_name)
            ]
            publicationList.extend(pubs)

    return publicationList


# new func by Islam Abdelghaffar
def get_publication_keywords_count(publication_name, keywords_or_topics):
    keywords_topics_counts = []
    print("publication_name.strip(): ", publication_name.strip())
    publication_node = Publication.nodes.get(title=publication_name)
    content_words = (str(publication_node.title) +
                     str(publication_node.abstract)).lower()
    if keywords_or_topics == "keywords":
        print("keywords")
        for keyword in publication_node.keywords.all():
            keyword_count = content_words.count(keyword.keyword.lower())
            keywords_topics_counts.append({
                "text": keyword.keyword,
                "value": keyword_count
            })

    elif keywords_or_topics == "topics":
        print("topics")
        for topic in publication_node.topics.all():
            keyword_count = content_words.count(topic.topic.lower())
            keywords_topics_counts.append({
                "text": topic.topic,
                "value": keyword_count
            })
    return keywords_topics_counts


def get_commen_keywords_or_topics(first_paper_keywordsCount, second_paper_keywordsCount):
    final_intersection = []
    keywords_topics_first_paper = {d['text']
                                   for d in first_paper_keywordsCount}
    keywords_topics_second_paper = {d['text']
                                    for d in second_paper_keywordsCount}
    common_keywords_or_topics = list(
        keywords_topics_first_paper & keywords_topics_second_paper)

    if len(common_keywords_or_topics) == 0:
        print("common_keywords_or_topics")
        final_intersection.append({
            "intersection": [],
            "intersectionDetails": []
        })
        return final_intersection

    first_paper_dict = {d['text']: d["value"]
                        for d in first_paper_keywordsCount}
    second_paper_dict = {d["text"]: d["value"]
                         for d in second_paper_keywordsCount}
    intersection = [
        {
            "text": topic_or_keyword,
            "value": first_paper_dict.get(topic_or_keyword, 0) + second_paper_dict.get(topic_or_keyword, 0),
        }
        for topic_or_keyword in common_keywords_or_topics
    ]

    intersectionDetails = [
        {
            "text": topic_or_keyword,
            "firstPapercount": first_paper_dict.get(topic_or_keyword, 0),
            "secondPaperCount": second_paper_dict.get(topic_or_keyword, 0)
        }
        for topic_or_keyword in common_keywords_or_topics
    ]
    final_intersection.append({
        "intersection": intersection,
        "intersectionDetails": intersectionDetails
    })
    return final_intersection

# new fun implemented by islam abdelghaffar


def get_author_keywordTopic_eventBased(author_name, event_name, keyword_or_topic):
    author_node = Author.nodes.get(author_name=author_name)
    event_node = Event.nodes.filter(conference_event_name_abbr=event_name)

    if keyword_or_topic == "keyword":
        author_keywords = author_node.keywords.all()
        event_keywords = set(k.keyword for k in event_node.keywords.all())
        author_event_keywords_weights = [
            {
                "text": author_keyword.keyword,
                'value': author_node.keywords.relationship(author_keyword).weight
            }
            for author_keyword in author_keywords
            if author_keyword.keyword in event_keywords]

        return author_event_keywords_weights

    elif keyword_or_topic == "topic":
        author_topics = author_node.topics.all()
        event_topics = set(t.topic for t in event_node.topics.all())
        author_event_topics_weights = [
            {
                "text": author_topic.topic,
                "value": author_node.topics.relationship(author_topic).weight
            } for author_topic in author_topics
            if author_topic.topic in event_topics]

        print("author_event_topics_weights: ", author_event_topics_weights)
        return author_event_topics_weights


def get_conf_events(conf_name):
    conference_event_objs = Event.nodes.filter(
        conference_event_name_abbr__startswith=conf_name)
    return conference_event_objs


def get_Shared_years_between_confs(confs_events_list):
    confs_years = []
    for conf in confs_events_list:
        conf_event_name = conf["conference"]
        conf_events_list = conf["events"]
        years = get_years_of_conf(conf_events_list)
        confs_years.append({
            "conference": conf_event_name,
            "years": years
        })
    common_years = get_common_years(confs_years)
    return sorted(common_years)


def get_years_of_conf(conf_events_list):
    conf_years = set()
    for event in conf_events_list:
        match = re.search(r'\d{4}', event.conference_event_name_abbr)
        if match:
            conf_years.add(match.group())
    return list(conf_years)


def get_common_years(confs_years):
    common_years = set(confs_years[0]['years'])

    for conf in confs_years[1:]:
        common_years &= set(conf['years'])

    return list(common_years)


def get_shared_events_basedOn_shared_years(confs_events_list, common_years):
    conf_shared_events = []

    for conf in confs_events_list:
        shared_events = []

        for event in conf['events']:
            print("match: ", event.conference_event_name_abbr)
            match = re.search(r'\d{4}', event.conference_event_name_abbr)
            if match is not None and match.group() in common_years:
                event_name = re.split("-", event.conference_event_name_abbr)[0]
                authors_list = [
                    author.semantic_scolar_author_id for author in event.authors.all()]
                existing_event = next((item for item in shared_events
                                       if item["event_name"] == event_name), None)
                if existing_event:
                    existing_event["event_authors"].extend(authors_list)
                else:
                    shared_events.append({
                        "event_name": event_name,
                        "event_authors": authors_list
                    })

        if shared_events:
            conf_shared_events.append({
                'conference_name': conf['conference'],
                'events': shared_events
            })

    return conf_shared_events


def get_shared_events_keyword_basedOn_shared_years(shared_based, confs_events_list, common_years):
    conf_shared_events = []

    for conf in confs_events_list:
        shared_events = []

        for event in conf['events']:
            print("get data of: ", event.conference_event_name_abbr)
            match = re.search(r'\d{4}', event.conference_event_name_abbr)
            if match is not None and match.group() in common_years:
                event_name = re.split("-", event.conference_event_name_abbr)[0]
                keywords_list = [
                    keyword.keyword for keyword in event.keywords.all()]
                existing_event = next((item for item in shared_events
                                       if item["event_name"] == event_name), None)
                if existing_event:
                    existing_event[shared_based].extend(keywords_list)
                else:
                    shared_events.append({
                        "event_name": event_name,
                        shared_based: keywords_list
                    })

        if shared_events:
            conf_shared_events.append({
                'conference_name': conf['conference'],
                'events': shared_events
            })
    print("shared events between conferences get collectted")
    return conf_shared_events

# new function by Islam


def get_shared_authors_from_events(shared_years, shared_years_events):
    # print("shared_years_events",shared_years_events)
    final_data = []
    shared_years_events_length = len(shared_years_events)
    if shared_years_events_length == 1:
        conf_events = shared_years_events[0]["events"]
        events_author_count = [len(event["event_authors"])
                               for event in conf_events]
        final_data.append({
            "name": shared_years_events[0]["conference_name"],
            "data": events_author_count
        })
        print("final_data: ", final_data)

        return [final_data]

    else:
        # get all combinations of any length
        all_combs = []
        shared_authors_combs = []
        final_data = []
        conference_names = [item['conference_name']
                            for item in shared_years_events]
        for r in range(2, len(conference_names) + 1):
            all_combs.extend(combinations(conference_names, r))

        for comb in all_combs:
            relevant_confs = []
            for conf in comb:
                relevant_conf = [
                    item for item in shared_years_events if item["conference_name"] == conf]
                relevant_confs.append(relevant_conf)
            shared_authors_combs = get_shared_authors_between_combs(
                shared_years, relevant_confs)

            final_data.append(shared_authors_combs)

        print("shared_authors_combs: ", final_data)
        return final_data


def get_shared_authors_between_combs(shared_years, relevant_confs):
    events_to_compare = []
    for year in shared_years:
        events_in_year = []
        print("relevant_confs", relevant_confs)
        for conf in relevant_confs:
            for event in conf[0]["events"]:
                if year in event["event_name"]:
                    events_in_year.append(event)
                    break
        if events_in_year:
            events_to_compare.append(events_in_year)
    final = []
    for event in events_to_compare:
        events_name = []
        events_authors = []
        for obj in event:
            events_name.append(re.sub('\\d{4}$', '', obj["event_name"]))
            events_authors.append(obj["event_authors"])
        common_elements = common_elements_in_set(events_authors)
        final.append({
            "name": events_name,
            "data": len(common_elements)
        })
    final = add_all_data_in_one_array(final)
    return final


def get_shared_between_combs(full_name, shared_based, shared_years, shared_years_events):
    events_to_compare = []
    for year in shared_years:
        events_in_year = []
        for conf in shared_years_events:
            for event in conf[0]["events"]:
                if year in event["event_name"]:
                    events_in_year.append(event)
                    break
        if events_in_year:
            events_to_compare.append(events_in_year)
    final = []
    for event in events_to_compare:
        events_name = []
        events_authors = []
        for obj in event:
            if full_name:
                events_name.append(obj["event_name"])
            else:
                events_name.append(re.sub('\\d{4}$', '', obj["event_name"]))
            events_authors.append(obj[shared_based])
        final.append({
            "name": events_name,
            "data": len(common_elements_in_set(events_authors))
        })
    final = add_all_data_in_one_array(final)
    return final


def get_shared_between_events_combs(shared_based, events):
    final = []
    events_name = []
    events_authors_list = []
    for event in events:
        for obj in event:
            events_name.append((obj["event_name"]))
            events_authors_list.append(obj[shared_based])
    common_authors = common_elements_in_set(events_authors_list)
    final.append({
        "name": events_name,
        "data": len(common_authors),
        "authors_names": [author for author in common_authors]
    })
    return final


def common_elements_in_set(lst):
    if (len(lst) == 0):
        return set()
    common_elements_in_set = set(lst[0])

    for sublist in lst[1:]:
        common_elements_in_set.intersection_update(sublist)

    return common_elements_in_set


def add_all_data_in_one_array(final_array):
    output_data = {}

    for item in final_array:
        name_tuple = tuple(item['name'])
        if name_tuple not in output_data:
            output_data[name_tuple] = []

        output_data[name_tuple].append(item['data'])

    output_data = [{'name': list(name), 'data': data}
                   for name, data in output_data.items()]
    return output_data


def get_shared_from_events(shared_based, shared_years, shared_years_events):
    final_data = []
    shared_years_events_length = len(shared_years_events)
    if shared_years_events_length == 1:
        conf_events = shared_years_events[0]["events"]
        events_author_count = [len(event[shared_based])
                               for event in conf_events]
        final_data.append({
            "name": shared_years_events[0]["conference_name"],
            "data": events_author_count
        })
        print("final_data: ", final_data)

        return [final_data]

    else:
        # get all combinations of any length
        all_combs = []
        shared_authors_combs = []
        final_data = []
        conference_names = [item['conference_name']
                            for item in shared_years_events]
        for r in range(2, len(conference_names) + 1):
            all_combs.extend(combinations(conference_names, r))

        for comb in all_combs:
            relevant_confs = []
            for conf in comb:
                relevant_conf = [
                    item for item in shared_years_events if item["conference_name"] == conf]
                relevant_confs.append(relevant_conf)
            shared_authors_combs = get_shared_between_combs(
                full_name=False,
                shared_based="keywords",
                shared_years=shared_years,
                shared_years_events=relevant_confs)

            final_data.append(shared_authors_combs)

        print("shared_authors_combs: ", final_data)
        return final_data


def get_events_authors(events):
    results = []
    for event in events:
        event_authors = Event.nodes.get(
            conference_event_name_abbr=event).authors.all()
        results.append({
            "event_name": event,
            "authors": [author.author_name for author in event_authors]
        })

    return results


def get_shared_authors_basedOn_combs(events_authors, all_combs):
    result = []
    final_sets = []
    authors_name = []
    for comb in all_combs:
        sets = []
        relevant_confs = []
        for event in comb:
            relevant_conf = [
                item for item in events_authors if item["event_name"] == event]
            relevant_confs.append(relevant_conf)
        shared_authors_combs = get_shared_between_events_combs(
            shared_based="authors",
            events=relevant_confs)

        names = sorted(shared_authors_combs[0]["name"])
        print("names: ", names)
        value = shared_authors_combs[0]["data"]
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
                "authors_names": shared_authors_combs[0]["authors_names"]
            })
    print("***********************************************************")
    print("shared_authors_combs: ", final_sets)
    print("******************************************************")
    print("authors_name: ", authors_name)
    result.append(final_sets)
    result.append(authors_name)

    return result


# new Func by Islam
def get_relavant_publication_for_aList(conf_name, list_of_keywords_topics):
    if (len(list_of_keywords_topics) != 0):
        keyphrase_events = get_keyphrase_events(
            conf_name, list_of_keywords_topics)
        keyphrase_publications_count = get_keyphrase_publications_based_event(
            conf_name, keyphrase_events)

        return keyphrase_publications_count


# new func by Islam
def get_keyphrase_events(conf_name, list_of_keywords_topics):
    conf_events = get_conf_events(conf_name=conf_name)
    data = []
    for keyphrase in list_of_keywords_topics:
        keyphrase_events = [event for event in conf_events if keyphrase in [
            Keyword.keyword for Keyword in event.keywords.all()]]
        data.append({
            "keyphrase": keyphrase,
            "events": keyphrase_events
        })

    return data

# new func by Islam


def get_keyphrase_publications_based_event(conf_name, keyphrase_events):
    data_dict = {}
    all_event = get_conf_events(conf_name)
    if keyphrase_events:
        for obj in keyphrase_events:
            keywordTopic_name = obj["keyphrase"]

            if keywordTopic_name not in data_dict:
                data_dict[keywordTopic_name] = []
            for event in all_event:
                if event in obj["events"]:
                    publications = get_relavant_publication(
                        event.conference_event_name_abbr, "keyword", keywordTopic_name)

                    if publications is not None:
                        count = len([pub.title for pub in publications])
                        data_dict[keywordTopic_name].append(count)

                else:
                    count = 0
                    data_dict[keywordTopic_name].append(count)

    data = [{"name": k, "data": v} for k, v in data_dict.items()]

    return data


def Conf_All_years(conf_name):
    years = []
    all_event = get_conf_events(conf_name)
    for event in all_event:
        year = re.sub(
            "[^0-9]", "", event.conference_event_name_abbr.split('-')[0])
        years.append(year)

    return years
