# implemented by Islam Abdelghaffar
from conferences import conference_utils as confutils
from conferences.models.graph_db_entities import Conference as graphConference
from conferences.models.graph_db_entities import *
from neomodel import match, Traversal
import re
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from neomodel import *


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


def get_AuthorPaper_weight_event_based(conference_event_objs, keyword_or_topic):
    """retrieves weights of a specific word in a list on conference events. If the word does not exist in an event, its weight is zero

    Args:
        conference_event_objs (list): list of conference event objects
        word (str): any topic or keyword
        keyword_or_topic (str): decides the type of the word --> "topic" or "keyword"

    Returns:
        list: list of data dictionaries of the weight of a word in every given conference event
    """

    result_data = []

    # islam Updated
    for conference_event in conference_event_objs:
        if keyword_or_topic == 'topic' or keyword_or_topic == 'Authors':
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

        elif keyword_or_topic == 'keyword' or keyword_or_topic == 'Publications':
            # islam Updated
            check_exist = Event.nodes.get_or_none(
                conference_event_name_abbr=conference_event.conference_event_name_abbr)
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

def get_relavant_publication(even_name,keyword_or_topic,keywordTopic_name):

        event_obj_publications = Event.nodes.filter(
        conference_event_name_abbr=even_name).publications.all()
        if keyword_or_topic == "keyword":
            publicationsList = [
            pub for pub in event_obj_publications 
            if pub.keywords.filter(keyword=keywordTopic_name)
            ]
            return publicationsList
        
        elif  keyword_or_topic == "topic" :
            publicationsList=[
                pub for pub in event_obj_publications
                if pub.topics.filter(topics=keywordTopic_name)
            ]
            return publicationsList
