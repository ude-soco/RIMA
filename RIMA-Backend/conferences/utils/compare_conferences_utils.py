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


    return result_data

# done


def get_total_shared_authors_between_conferences(conference_event_objs):
    """
    The function `get_total_shared_authors_between_conferences` retrieves the total number of shared authors between different conference events.
    
    :param conference_event_objs: The parameter `conference_event_objs` is a list of conference event objects. Each conference event object represents a conference event and contains information such as the conference event name abbreviation, authors, and year
    :return: a list of dictionaries. Each dictionary contains information about a conference event, including the number of authors, the conference event abbreviation, the list of event authors, and the year of the conference event.
    """
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
    shared_words = list(set([word for word in all_words if all_words.count(
        word) == len(conference_events_list)]))
    noOfSharedword = len(shared_words)


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
        for model in models_data_total[count]:

            if model[keyword_or_topic] in list_of_final_words.keys():
                list_of_final_words[model[keyword_or_topic]] += model['weight']
            else:
                list_of_final_words[model[keyword_or_topic]] = model['weight']
        count += 1


    sorted_list_of_final_words = {k: v for k, v in sorted(
        list_of_final_words.items(), key=lambda item: item[1])}


    return sorted_list_of_final_words


def get_author_paper_weight_event_based(conference_event_objs, authorsOrPubs):
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


    for publication in conference_event_papers_data:
        pubHasKeyword = publication.keywords.filter(keyword=keyword)
        if pubHasKeyword:
            filtered_conference_event_papers_data.append(publication)



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


    return titles_abstracts


def get_conf_total_authors(conf_name):
    """
    The function `get_conf_total_authors` returns the total number of authors associated with a given conference name abbreviation.
    
    :param conf_name: The parameter `conf_name` is a string that represents the abbreviation of a conference name
    :return: The number of authors associated with the specified conference name.
    """
    authors_number = 0
    conf_node = Conference.nodes.filter(conference_name_abbr=conf_name)
    if conf_node:
        authors_number = len(conf_node.authors.all())
    return authors_number


def get_conf_total_publications(conf_name):
    """
    The function `get_conf_total_publications` returns the total number of publications associated with a given conference name abbreviation.
    
    :param conf_name: The parameter `conf_name` is a string that represents the abbreviation of a conference name
    :return: The number of publications associated with the conference specified by the `conf_name` parameter.
    """
    publications_number = 0
    conf_node = Conference.nodes.filter(conference_name_abbr=conf_name)
    if conf_node:
        publications_number = len(conf_node.publication.all())
    return publications_number

# new func by Islam Abdelghaffar


def get_relavant_publication(event_list, keyword_or_topic, keywordTopic_name):
    """
    The function `get_relavant_publication` takes in a list of events, a keyword or topic, and a keyword or topic name, and returns a list of relevant publications based on the keyword or topic.
    
    :param event_list: A list of events
    :param keyword_or_topic: The parameter "keyword_or_topic" is a string that specifies whether the search should be based on a keyword or a topic. It can have two possible values: "keyword" or "topic"
    :param keywordTopic_name: The keyword or topic name that you want to search for in the publications
    :return: a list of relevant publications based on the given event list, keyword or topic, and keyword or topic name.
    """
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
    """
    The function `get_publication_keywords_count` takes a publication name and a choice between "keywords" or "topics" as input, and returns a list of dictionaries containing the text and count of each keyword or topic found in the publication's title and abstract.
    
    :param publication_name: The name of the publication for which you want to get the keyword or topic counts
    :param keywords_or_topics: The parameter "keywords_or_topics" is a string that specifies whether you want to count the occurrences of keywords or topics in the publication. It can have two possible values: "keywords" or "topics"
    :return: a list of dictionaries, where each dictionary contains the text of a keyword or topic and its corresponding count in the publication.
    """
    keywords_topics_counts = []
    publication_node = Publication.nodes.get(title=publication_name)
    content_words = (str(publication_node.title) +
                     str(publication_node.abstract)).lower()
    if keywords_or_topics == "keywords":
        for keyword in publication_node.keywords.all():
            keyword_count = content_words.count(keyword.keyword.lower())
            keywords_topics_counts.append({
                "text": keyword.keyword,
                "value": keyword_count
            })

    elif keywords_or_topics == "topics":
        for topic in publication_node.topics.all():
            keyword_count = content_words.count(topic.topic.lower())
            keywords_topics_counts.append({
                "text": topic.topic,
                "value": keyword_count
            })
    return keywords_topics_counts


def get_commen_keywords_or_topics(first_paper_keywordsCount, second_paper_keywordsCount):
    """
    The function `get_commen_keywords_or_topics` takes two lists of dictionaries representing keyword counts in two papers, and returns a list containing the intersection of keywords/topics between the two papers along with their respective counts.
    
    :param first_paper_keywordsCount: A list of dictionaries containing the keywords and their respective counts in the first paper
    :param second_paper_keywordsCount: The `second_paper_keywordsCount` parameter is a list of dictionaries. Each dictionary represents a keyword or topic from the second paper and contains two key-value pairs: "text" and "value". "text" represents the keyword or topic text, and "value" represents the count or frequency of that
    :return: a list containing a dictionary with two keys: "intersection" and "intersectionDetails". The value of "intersection" is a list of dictionaries, where each dictionary represents a common keyword or topic between the two papers and includes the text of the keyword or topic and the combined value from both papers. The value of "intersectionDetails" is also a list of dictionaries, where each dictionary represents
    """
    final_intersection = []
    keywords_topics_first_paper = {d['text']
                                   for d in first_paper_keywordsCount}
    keywords_topics_second_paper = {d['text']
                                    for d in second_paper_keywordsCount}
    common_keywords_or_topics = list(
        keywords_topics_first_paper & keywords_topics_second_paper)

    if len(common_keywords_or_topics) == 0:
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


# def get_author_keywordTopic_event_based(author_name, event_name, keyword_or_topic):
#     author_node = Author.nodes.get(author_name=author_name)
#     event_node = Event.nodes.filter(conference_event_name_abbr=event_name)

#     if keyword_or_topic == "keyword":
#         author_keywords = author_node.keywords.all()
#         event_keywords = set(k.keyword for k in event_node.keywords.all())
#         author_event_keywords_weights = [
#             {
#                 "text": author_keyword.keyword,
#                 'value': author_node.keywords.relationship(author_keyword).weight
#             }
#             for author_keyword in author_keywords
#             if author_keyword.keyword in event_keywords]

#         return author_event_keywords_weights

#     elif keyword_or_topic == "topic":
#         author_topics = author_node.topics.all()
#         event_topics = set(t.topic for t in event_node.topics.all())
#         author_event_topics_weights = [
#             {
#                 "text": author_topic.topic,
#                 "value": author_node.topics.relationship(author_topic).weight
#             } for author_topic in author_topics
#             if author_topic.topic in event_topics]

#         return author_event_topics_weights


def get_conf_events(conf_name):
    """
    The function `get_conf_events` retrieves conference event objects based on a given conference name abbreviation.
    
    :param conf_name: The `conf_name` parameter is a string that represents the abbreviation or prefix of a conference event name
    :return: a list of conference event objects that have a name abbreviation starting with the given conference name.
    """
    conference_event_objs = Event.nodes.filter(
        conference_event_name_abbr__startswith=conf_name)
    return conference_event_objs


def get_author_keywordTopic_event_based(confs_events_list):
    """
    The function "get_author_keywordTopic_event_based" takes a list of conferences and their associated events, extracts the years of each event, finds the common years across all conferences, and returns a sorted list of those common years.
    
    :param confs_events_list: A list of dictionaries where each dictionary represents a conference and its associated events. Each dictionary has two keys: "conference" which represents the name of the conference, and "events" which represents a list of events associated with that conference
    :return: a sorted list of common years from the given list of conference events.
    """
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
    """
    The function `get_years_of_conf` extracts the years from a list of conference event names and returns them as a list.
    
    :param conf_events_list: The `conf_events_list` parameter is a list of conference events. Each conference event has a `conference_event_name_abbr` attribute, which is a string representing the abbreviated name of the conference event
    :return: a list of unique years extracted from the conference event names in the given list.
    """
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


def get_shared_events_based_on_shared_years(confs_events_list, common_years):
    """
    The function `get_shared_events_based_on_shared_years` takes a list of conference events and a list of common years as input, and returns a list of shared events between conferences based on the common years.
    
    :param confs_events_list: The `confs_events_list` parameter is a list of dictionaries. Each dictionary represents a conference and its associated events. The structure of each dictionary is as follows:
    :param common_years: The parameter "common_years" is a list of years that represent the common years for which you want to find shared events
    :return: a list of dictionaries. Each dictionary represents a conference and its shared events. The dictionary contains the conference name and a list of shared events. Each shared event is represented by a dictionary containing the event name and a list of authors.
    """
    conf_shared_events = []

    for conf in confs_events_list:
        shared_events = []

        for event in conf['events']:
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


def get_shared_events_keyword_based_on_shared_years(shared_based, confs_events_list, common_years):
    """
    The function `get_shared_events_keyword_based_on_shared_years` retrieves shared events based on common years and organizes them by conference and event name, along with their associated keywords.
    
    :param shared_based: The parameter "shared_based" is a string that represents the type of shared information we are interested in. It could be "shared_keywords", "shared_topics", or any other relevant information that we want to extract based on the shared years
    :param confs_events_list: confs_events_list is a list of dictionaries, where each dictionary represents a conference and its associated events. Each dictionary has two keys: 'conference_name' and 'events'. 'conference_name' is a string representing the name of the conference, and 'events' is a list of dictionaries representing the
    :param common_years: The parameter "common_years" is a list of years that are considered common or shared years. These years are used to filter the events based on their conference event name abbreviation. Only events that have a year in their abbreviation that matches one of the common years will be included in the shared events list
    :return: a list of dictionaries. Each dictionary represents a conference and its shared events. The dictionary contains the conference name and a list of shared events. Each shared event is represented by a dictionary containing the event name and a list of keywords.
    """
    conf_shared_events = []

    for conf in confs_events_list:
        shared_events = []

        for event in conf['events']:
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
    return conf_shared_events

# new function by Islam


def get_shared_authors_from_events(shared_years, shared_years_events):
    """
    The function `get_shared_authors_from_events` takes in a list of shared years and a list of events from those years, and returns a list of combinations of conferences that have shared authors between them.
    
    :param shared_years: The shared_years parameter is a list of years that represent the years in which the events took place. For example, [2019, 2020, 2021]
    :param shared_years_events: The parameter `shared_years_events` is a list of dictionaries. Each dictionary represents a conference event and contains the following keys:
    :return: a list of dictionaries. Each dictionary represents a combination of conferences and contains the conference name and the number of authors shared between the conferences.
    """
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

        return final_data


def get_shared_authors_between_combs(shared_years, relevant_confs):
    """
    The function `get_shared_authors_between_combs` takes in a list of shared years and a list of relevant conferences, and returns the number of shared authors between events in each year.
    
    :param shared_years: The shared_years parameter is a list of years that represent the years in which the events occurred. For example, [2019, 2020, 2021]
    :param relevant_confs: The parameter "relevant_confs" is a list of dictionaries. Each dictionary represents a conference and contains information about the conference, including a list of events. Each event is represented by a dictionary with keys "event_name" and "event_authors"
    :return: a final array that contains information about the shared authors between combinations of events. Each element in the final array has a "name" field that represents the names of the events being compared, and a "data" field that represents the number of shared authors between those events.
    """
    events_to_compare = []
    for year in shared_years:
        events_in_year = []
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
    """
    The function `get_shared_between_combs` takes in a full name, a shared base, a list of shared years, and a list of shared years events, and returns a final array containing the names and the number of shared elements between the events.
    
    :param full_name: The parameter `full_name` is a boolean value that determines whether the full event name or just the year should be used in the comparison. If `full_name` is `True`, the full event name will be used. If `full_name` is `False`, only the year will be used
    :param shared_based: The parameter "shared_based" is a string that represents the attribute based on which we want to find shared elements. It could be "authors", "keywords", or any other attribute that is present in the events data
    :param shared_years: The shared_years parameter is a list of years that represent the years in which the events occurred
    :param shared_years_events: The parameter `shared_years_events` is a list of dictionaries. Each dictionary represents a conference and contains information about the events that occurred in that conference. The events are stored in a list under the key "events". Each event is represented by a dictionary with keys such as "event_name" and "
    :return: the final array, which contains the names of the events and the number of shared elements in the data array.
    """
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
    """
    The function `get_shared_between_events_combs` takes a list of events and a shared attribute as input, and returns the number of common authors between the events along with their names.
    
    :param shared_based: The parameter "shared_based" is a string that represents the key in the event objects that contains the shared information
    :param events: The "events" parameter is a list of lists. Each inner list represents an event and contains dictionaries with information about the event. Each dictionary has a key "event_name" which represents the name of the event, and a key "shared_based" which represents the shared attribute between events
    :return: a list containing a dictionary. The dictionary has the following keys:
    - "name": a list of event names
    - "data": the number of common authors between the events
    - "authors_names": a list of the common authors' names
    """
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
    """
    The function `common_elements_in_set` takes a list of sets as input and returns a set containing the common elements present in all the sets.
    
    :param lst: The parameter `lst` is a list of sets. Each set represents a collection of elements. The function `common_elements_in_set` finds the common elements that are present in all sets in the list
    :return: a set of common elements in the input list.
    """
    if (len(lst) == 0):
        return set()
    common_elements_in_set = set(lst[0])

    for sublist in lst[1:]:
        common_elements_in_set.intersection_update(sublist)

    return common_elements_in_set


def add_all_data_in_one_array(final_array):
    """
    The function takes an array of dictionaries, groups them by the 'name' key, and returns a new array with the grouped data.
    
    :param final_array: The `final_array` parameter is a list of dictionaries. Each dictionary in the list represents an item and has two keys: 'name' and 'data'. The value of the 'name' key is a list of strings, and the value of the 'data' key can be any data type
    :return: a modified version of the input array, where the data is grouped together based on the name. Each unique name is used as a key in the output dictionary, and the corresponding data is appended to the list associated with that key. The function then converts the dictionary back into a list of dictionaries, where each dictionary has a 'name' key and a 'data' key.
    """
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
    """
    The function `get_shared_from_events` takes in shared-based criteria, shared years, and shared years events, and returns a list of combinations of relevant conferences and their shared authors.
    
    :param shared_based: The parameter `shared_based` is a string that specifies the basis for determining shared authors. It can take values like "keywords", "affiliations", or any other criteria based on which shared authors are determined
    :param shared_years: The parameter "shared_years" is a list of years for which you want to calculate shared authors
    :param shared_years_events: The parameter "shared_years_events" is a list of dictionaries. Each dictionary represents a conference and contains two keys: "conference_name" and "events". The value of "conference_name" is a string representing the name of the conference. The value of "events" is a list of dictionaries,
    :return: a list of dictionaries. Each dictionary contains the name of a conference and the data associated with it. The data represents the count of authors for each event in the conference.
    """
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

        return final_data


def get_events_authors(events):
    """
    The function `get_events_authors` takes a list of event names as input and returns a list of dictionaries, where each dictionary contains the event name and a list of authors associated with that event.
    
    :param events: A list of event names
    :return: a list of dictionaries. Each dictionary contains the event name and a list of authors associated with that event.
    """
    results = []
    for event in events:
        event_authors = Event.nodes.get(
            conference_event_name_abbr=event).authors.all()
        results.append({
            "event_name": event,
            "authors": [author.author_name for author in event_authors]
        })

    return results


def get_shared_authors_based_on_combs(events_authors, all_combs):
    """
    The function `get_shared_authors_based_on_combs` takes in a list of events and authors, and a list of combinations of events. It calculates the shared authors between each combination of events and returns the result as a list of sets and a list of authors' names.
    
    :param events_authors: A list of dictionaries where each dictionary represents an event and its authors. Each dictionary has two keys: "event_name" (string) and "authors" (list of strings)
    :param all_combs: The parameter "all_combs" is a list of lists. Each inner list represents a combination of events. For example, if there are three events A, B, and C, one possible combination could be [A, B]
    :return: a list containing two elements. The first element is a list of dictionaries, each representing a set of shared authors between events. Each dictionary contains the names of the shared authors, the value of the shared authors, and the name of the set. The second element is a list of dictionaries, each representing a set of shared authors between events. Each dictionary contains the name of the set
    """
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

    result.append(final_sets)
    result.append(authors_name)

    return result


# new Func by Islam
def get_relavant_publication_for_aList(conf_name, list_of_keywords_topics):
    """
    The function `get_relavant_publication_for_aList` returns the count of relevant publications based on a conference name and a list of keywords/topics.
    
    :param conf_name: The name of the conference or event for which you want to find relevant publications
    :param list_of_keywords_topics: A list of keywords or topics that you want to search for in the publications
    :return: the count of relevant publications based on a given conference name and a list of keywords/topics.
    """
    if (len(list_of_keywords_topics) != 0):
        keyphrase_events = get_keyphrase_events(
            conf_name, list_of_keywords_topics)
        keyphrase_publications_count = get_keyphrase_publications_based_event(
            conf_name, keyphrase_events)

        return keyphrase_publications_count


# new func by Islam
def get_keyphrase_events(conf_name, list_of_keywords_topics):
    """
    The function `get_keyphrase_events` takes a conference name and a list of keywords/topics as input, retrieves the conference events, and returns a list of dictionaries containing the keyphrase and the events associated with that keyphrase.
    
    :param conf_name: The `conf_name` parameter is the name of the conference for which you want to retrieve events
    :param list_of_keywords_topics: A list of keywords or topics that you want to search for in the conference events
    :return: a list of dictionaries. Each dictionary contains a keyphrase and a list of events associated with that keyphrase.
    """
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
    """
    The function `get_keyphrase_publications_based_event` retrieves the number of relevant publications for each keyphrase event in a given conference.
    
    :param conf_name: The `conf_name` parameter represents the name of a conference
    :param keyphrase_events: A list of dictionaries where each dictionary contains two keys: "keyphrase" and "events". "keyphrase" is a string representing a specific keyphrase, and "events" is a list of strings representing the events related to that keyphrase
    :return: a list of dictionaries, where each dictionary contains the name of a keyword topic and the corresponding data (a list of publication counts) associated with that keyword topic.
    """
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


def conf_all_years(conf_name):
    """
    The function `conf_all_years` takes a conference name as input and returns a list of years corresponding to all the events of that conference.
    
    :param conf_name: The `conf_name` parameter is the name of a conference
    :return: a list of years.
    """
    years = []
    all_event = get_conf_events(conf_name)
    for event in all_event:
        year = re.sub(
            "[^0-9]", "", event.conference_event_name_abbr.split('-')[0])
        years.append(year)

    return years
