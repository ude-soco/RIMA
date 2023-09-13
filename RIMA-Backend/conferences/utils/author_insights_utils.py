from conferences.models.graph_db_entities import *
from collections import defaultdict
from collections import OrderedDict
from collections import Counter
import ast
import re


def get_author_network(author_id):
    """
    The function `get_author_network` retrieves the co-authors of a given author and returns the data in a specific format.
    
    :param author_id: The `author_id` parameter is the unique identifier of the author for whom we want to retrieve the author network
    :return: the result of calling the "handle_coauthor_data" function with the "author_nodes" as an argument.
    """
    all_authors = []
    author = Author.nodes.filter(semantic_scolar_author_id=author_id)
    author_nodes = author.co_authors.all()

    author_nodes.extend(author)
    return handle_coauthor_data(author_nodes)


def get_event_coauthor_data(event):
    """
    The function "get_event_coauthor_data" retrieves co-author data for a given event.
    
    :param event: The "event" parameter is an object representing an event. It is assumed to have a property called "authors" which is a collection of author nodes
    :return: the result of calling the "handle_coauthor_data" function with the "author_nodes" as an argument.
    """
    author_nodes = event.authors.all()

    return handle_coauthor_data(author_nodes)


def handle_coauthor_data(author_nodes):
    """
    The function `handle_coauthor_data` takes a list of author nodes, creates a list of event authors, generates coauthor links within the list, and returns the combined list of event authors and coauthors.
    
    :param author_nodes: The parameter `author_nodes` is a list of objects representing authors. Each author object has the following attributes:
    :return: a list that contains dictionaries representing the event authors and their co-authors.
    """
    event_authors_list = []
    all_author_couthors_list = []
    for author_node in author_nodes:
        event_authors_list.append({
            'data':
            {
                "id": author_node.semantic_scolar_author_id,
                "label": author_node.author_name
            }
        })

    all_author_couthors_list = generate_coauthor_links_within_list(
        author_nodes)

    return event_authors_list + all_author_couthors_list


def get_author_pubs_over_years(author_id):
    """
    The function `get_author_pubs_over_years` retrieves the number of publications for a given author over the years.
    
    :param author_id: The `author_id` parameter is the unique identifier of the author. It is used to retrieve the author node from the database
    :return: the count of publications for a given author over the years.
    """
    author_node = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()

    pubs_counst = get_publications_with_years_event_based(author_pubs)

    return pubs_counst


def filter_publication_based_on_confs(author_id, selectedConfs):
    """
    The function filters publications based on selected conference abbreviations and returns the count of publications with years and event information.
    
    :param author_id: The author_id is the unique identifier of the author. It is used to retrieve the author's information from the database
    :param selectedConfs: The selectedConfs parameter is a list of conference names or abbreviations that you want to filter the publications based on
    :return: a list of publications with their corresponding years and event information.
    """
    author_node = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()

    filtered_pubs = [pub for pub in author_pubs if pub.published_in_Confs[0].conference_name_abbr.strip()
                     in selectedConfs]

    pubs_counst = get_publications_with_years_event_based(filtered_pubs)
    return pubs_counst


def get_publications_with_years_conf_based(author_pubs):
    """
    The function `get_publications_with_years_conf_based` takes a list of author publications and returns a dictionary containing the years of publication, the count of publications for each year, and the set of conference names.
    
    :param author_pubs: A list of publication objects for a specific author. Each publication object has the following attributes:
    :return: a dictionary containing the years, count of publications for each year, and the set of conference names for the given author's publications.
    """
    pubs_counst = {}

    years = [pub.years for pub in author_pubs]
    publicationsConfs = [
        pub.published_in_Confs[0].conference_name_abbr for pub in author_pubs]
    publicationsConfs = set(publicationsConfs)
    sorted_years = sorted(years)
    counter = Counter(sorted_years)
    identities = list(counter.keys())
    pubs_counst = {"years": identities,
                   "count": list(counter.values()),
                   "conferences": publicationsConfs}

    return pubs_counst


def get_publications_with_years_event_based(author_pubs):
    """
    The function `get_publications_with_years_event_based` takes a list of author publications and returns a dictionary containing the count of publications for each event category and year, along with the list of unique years and conferences.
    
    :param author_pubs: The parameter `author_pubs` is expected to be a list of publication objects for a specific author. Each publication object should have the following attributes:
    :return: a dictionary named `pubs_counst`. This dictionary contains three key-value pairs:
    1. "series": a list of dictionaries, where each dictionary represents a category of events and contains two key-value pairs: "name" (the name of the category) and "data" (a list of counts corresponding to each year in the dataset).
    2. "categories": a
    """
    pubs_counst = {}

    years = [pub.years for pub in author_pubs]
    years = [year[:4] for year in years]

    events = [pub.published_in[0].conference_event_name_abbr for pub in author_pubs]
    publicationsConfs = [
        pub.published_in_Confs[0].conference_name_abbr for pub in author_pubs]

    publicationsConfs = set(publicationsConfs)
    counter = Counter(events)
    category_data = defaultdict(lambda: defaultdict(int))
    pattern = re.compile(r'(\D+)(\d+-*\d*)')

    for key, count in counter.items():
        match = pattern.match(key)
        if match:
            category, year = match.groups()[:2]
            year = year.split("-")[0]
            category_data[category][year] += count

    identities = sorted(set(years))
    series = []
    for category, years in category_data.items():
        data = []
        for year in identities:
            if year in years:
                data.append(years[year])
            else:
                data.append(0)
        series.append({"name": category, "data": data})

    pubs_counst = {
        "series": series,
        "categories": identities,
        "conferences": publicationsConfs
    }

    return pubs_counst


def get_author_publications(author_id):
    """
    The function `get_author_publications` retrieves the publications of an author based on their semantic scholar author ID.
    
    :param author_id: The `author_id` parameter is the unique identifier of the author. It is used to filter the `Author` nodes in the database and retrieve the publications associated with that author
    :return: a list of publications associated with the author identified by the given author_id.
    """
    author_node = Author.nodes.filter(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()
    return author_pubs



def get_author_detailed_info(author_id):
    """
    The function `get_author_detailed_info` retrieves detailed information about an author given their author ID.
    
    :param author_id: The author_id parameter is the unique identifier for the author in the Semantic Scholar database
    :return: a dictionary containing detailed information about an author. The dictionary includes the author's name, the count of their publications, their Semantic Scholar author ID, and their author URL.
    """
    author_data = {}
    author_node = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id.strip())
    author_keywords = author_node.keywords.all()
    author_interests = author_node.topics.all()
    author_publications = len(author_node.published.all())
    author_data = {
        "author_name": author_node.author_name,
        "publications_count": author_publications,
        "semantic_scolar_author_id": author_node.semantic_scolar_author_id,
        "author_url": author_node.author_url,
    }
    return author_data


def generate_coauthor_links_within_list(author_nodes):
    """
    Generates a list of dictionaries representing co-author links between authors within the input list.

    Args:
        author_nodes (list): A list of author nodes.

    Returns:
        list: A list of dictionaries representing co-author links. Each dictionary contains information about the co-author
              link, including the source author ID, target author ID, and a unique ID for the link.
    """
    all_author_couthors_list = []
    for author_node in author_nodes:
        co_author_nodes = author_node.co_authors.all()
        for co_author in co_author_nodes:
            if co_author in author_nodes:
                all_author_couthors_list.append({
                    'data': {
                        "id": author_node.semantic_scolar_author_id + co_author.semantic_scolar_author_id,
                        "source": author_node.semantic_scolar_author_id,
                        "target": co_author.semantic_scolar_author_id
                    }
                })
    return all_author_couthors_list


def create_author_publication_links(author_node):
    """
    Generates a list of dictionaries containing information about an author's published works.

    Args:
        author_node (object): An author node object.

    Returns:
        list: A list of dictionaries, where each dictionary contains two key-value pairs: "author name" (with the value set
              to the author node's author_name property) and "publication" (with the value set to the title of a publication).
    """
    author_publication_links = []
    publications = author_node.published.all()
    for publication in publications:
        author_publication_links.append({
            "author_name": author_node["author_name"],
            "publication ": publication.title
        })
    return author_publication_links


def generate_publication_citation_links(publication_node):
    """
    Generates a list of dictionaries containing information about the publications that cite a given publication.

    Args:
        publication_node (object): A publication node object.

    Returns:
        list: A list of dictionaries, where each dictionary contains two key-value pairs: "source publication" (with the
              value set to the title of the publication passed as input to the function) and "cited by" (with the value set
              to the title of the citing publication).
    """
    citations = publication_node.citiations
    pub_titles_list = []
    for obj in citations:
        pub_titles_list.append(
            {
                "source publication": publication_node.title,
                "cited by": obj.title
            }
        )
    return pub_titles_list


def get_publication_detailed_info(publication_id):
    """
    The function `get_publication_detailed_info` retrieves detailed information about a publication given its ID.
    
    :param publication_id: The publication_id parameter is the unique identifier for a publication. It is used to retrieve detailed information about a specific publication
    :return: a dictionary containing detailed information about a publication.
    """

    pubication = Publication.nodes.get_or_none(paper_id=publication_id)
    publication_citation_links = generate_publication_citation_links(
        pubication)
    publication_info = {
        "title": pubication.title,
        "paper id": pubication.paper_id,
        "abstract": pubication.abstract,
        "citation network": publication_citation_links,
        "paper_venu": pubication.paper_venu,
        "urls": pubication.urls,
        "year": pubication.years,
        "paper doi": pubication.paper_doi
    }
    return publication_info


def generate_pub_citations_info(publication_node):
    """
    Generates a list of dictionaries containing detailed information about the citations of a publication.

    Args:
        publication_node (object): A publication node object.

    Returns:
        list: A list of dictionaries, where each dictionary contains several key-value pairs related to a citation,
              including the number of authors, the intent, the level of influence, the paper ID, the title, the venue,
              and the year.
    """
    citationsString = publication_node.citiations
    citations = ast.literal_eval(citationsString)
    publication_citations_detailed_info = []
    for obj in citations:
        publication_citations_detailed_info.append(
            {
                "no_ofauthors": obj["authors"],
                "intent": obj["intent"],
                "isInfluential": obj["isInfluential"],
                "authors": obj["authors"],
                "paper Id": obj["paperId"],
                "title": obj["title"],
                "venue": obj["venue"],
                "year": obj["year"]
            }
        )
    return publication_citations_detailed_info


def generate_pub_citations_Count(publication_node):
    """
    The function `generate_pub_citations_Count` takes a publication node as input and returns a list of dictionaries containing information about the citations of that publication.
    
    :param publication_node: This parameter represents a node or object that contains information about a publication. It is assumed that this node has a property called "citations" which is a list of objects representing the citations of the publication
    :return: a list of dictionaries, where each dictionary represents a citation of a publication. Each dictionary contains information about the citation, such as the number of authors, intent, influence, authors, paper ID, title, venue, and year.
    """

    citations = publication_node.citiations
    publication_citations_count = []
    for obj in citations:
        publication_citations_count.append(
            {
                "no of authors": obj.authors,
                "intent": obj.intent,
                "isInfluential": obj.isInfluential,
                "authors": obj.authors,
                "paper Id": obj.paperId,
                "title": obj.title,
                "venue": obj.venue,
                "year": obj.year

            }
        )
    return publication_citations_count


def find_similar_authors_by_shared_keywords(author_id):
    """
    Finds authors who have a significant number of shared keywords with the target author.

    Args:
        author_id (str): The ID of the target author.

    Returns:
        list: A list of tuples, where each tuple contains an author's ID and the count of shared keywords with the target author.
    """
    target_author = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id)
    if (target_author is not None):
        target_keywords = set(
            [k.keyword for k in target_author.keywords.all()])
        shared_keyword_counts = defaultdict(int)
        all_other_author = Author.nodes.all()
        for other_author in all_other_author:
            if other_author.semantic_scolar_author_id == target_author.semantic_scolar_author_id:
                continue

            other_author_keywords = set(
                [k.keyword for k in other_author.keywords.all()])

            shared_keywords = target_keywords & other_author_keywords

            if (len(shared_keywords) > 2):
                shared_keyword_counts[other_author.semantic_scolar_author_id] = len(
                    shared_keywords)

        similar_authors = sorted(
            shared_keyword_counts.items(), key=lambda x: x[1])

        return similar_authors


def find_similar_authors_by_shared_topics(author_id):
    """
    Finds authors who have a significant number of shared topics with the target author.

    Args:
        author_id (str): The ID of the target author.

    Returns:
        list: A list of tuples, where each tuple contains an author's ID and the count of shared topics with the target author.
    """
    target_author = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id)
    if (target_author is not None):
        target_topics = set(
            [k.topic for k in target_author.topics.all()])
        shared_topic_counts = defaultdict(int)
        all_other_author = Author.nodes.all()
        for other_author in all_other_author:
            if other_author.semantic_scolar_author_id == target_author.semantic_scolar_author_id:
                continue

            other_author_topics = set(
                [k.topic for k in other_author.topics.all()])

            shared_topics = target_topics & other_author_topics

            if (len(shared_topics) > 1):
                shared_topic_counts[other_author.semantic_scolar_author_id] = len(
                    shared_topics)

        similar_authors = sorted(
            shared_topic_counts.items(), key=lambda x: x[1])

        return similar_authors


def get_available_events():
    """
    The function `get_available_events` retrieves all available events from the database.
    :return: a list of all the events stored in the database.
    """
    events = Event.nodes.all()
    return events


def get_all_authors(conferences):
    """
    The function "get_all_authors" retrieves all authors associated with a given list of conferences.
    
    :param conferences: The "conferences" parameter is a list of conference names or a single string representing a conference name. It is used to filter the authors based on the conferences they have published in. If the value is "All Conferences", it retrieves authors from all conferences
    :return: a list of dictionaries, where each dictionary represents an author. Each dictionary contains the author's name and their semantic scholar author ID.
    """
    if "All Conferences" in conferences:
        confs = Conference.nodes.all()
        conferences = [conf.conference_name_abbr for conf in confs]

    all_authors = []
    for conf in conferences:
        authors = Conference.nodes.filter(conference_name_abbr=conf).authors
        all_authors.extend(authors)

    authors_Names = ([{"name": author.author_name,
                       "label": author.semantic_scolar_author_id} for author in all_authors])

    authors_dict = {author["label"]: author for author in authors_Names}
    authors_Names = list(authors_dict.values())

    return authors_Names


def get_most_published_authors(conferences):
    """
    The function `get_most_published_authors` takes a list of conference names as input and returns a sorted list of authors based on their publication count in those conferences.
    
    :param conferences: The "conferences" parameter is a list of conference names or a single conference name. It represents the conferences for which we want to retrieve the most published authors
    :return: a list of authors, sorted by the number of publications they have.
    """
    data = []
    if "All Conferences" in conferences:
        allAuthors = Author.nodes.all()
        data = sort_authors(allAuthors)

    else:
        all_authors = []
        for conf in conferences:
            authors = Conference.nodes.filter(
                conference_name_abbr=conf).authors
            all_authors.extend(authors)

        data = sort_authors(all_authors)

    return data


def sort_authors(authors):
    """
    The function `sort_authors` takes a list of authors and returns a sorted list of dictionaries containing the author's semantic scholar author ID, name, and the count of their published works.
    
    :param authors: The parameter "authors" is a list of objects representing authors. Each author object has the following attributes:
    :return: a sorted list of dictionaries, where each dictionary represents an author and includes their semantic scholar author ID, author name, and the count of their published works. The list is sorted in descending order based on the count of published works.
    """
    author_pubs_counts = [{"label": author.semantic_scolar_author_id,
                           "name": author.author_name,
                           "count": len(author.published.all())} for author in authors]
    data = sorted(author_pubs_counts,
                  key=lambda x: x["count"], reverse=True)

    author_dict = {author["label"]: author for author in data}
    data = list(author_dict.values())

    return data


def get_author_pubs_In_year(author_id, pub_year):
    """
    The function `get_author_pubs_In_year` retrieves publications by a specific author in a given year.
    
    :param author_id: The author_id parameter is the unique identifier for the author. It is used to filter the Author nodes and find the specific author node with the given ID
    :param pub_year: The `pub_year` parameter is the year of publication that you want to filter the author's publications by
    :return: a list of publications (pubs) that were published in a specific year (pub_year) by a specific author (author_id).
    """
    author_node = Author.nodes.filter(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()

    pubs = [publication for publication in author_pubs
            if publication.years == pub_year.strip()]

    return pubs


def get_author_pubs_by_keyword_In_year(author_id, keyword, pub_year):
    """
    The function `get_author_pubs_by_keyword_In_year` returns a list of publications by a specific author in a given year that contain a specific keyword.
    
    :param author_id: The author's unique identifier
    :param keyword: The keyword parameter is a string that represents a specific keyword that you want to search for in the publications
    :param pub_year: The publication year of the publications you want to filter
    :return: a list of publications that match the given author ID, keyword, and publication year.
    """
    pubs = get_author_pubs_In_year(author_id, pub_year)
    pubs = [pub for pub in pubs if keyword in [
        keyword.keyword for keyword in pub.keywords.all()]]

    return pubs


def filter_publication_based_on_events(publication_List, events):
    """
    The function filters a list of publications based on a list of events.
    
    :param publication_List: The publication_List parameter is a list of objects representing publications. Each publication object has a published_in attribute, which is a list of objects representing the conference events in which the publication was presented. Each conference event object has a conference_event_name_abbr attribute, which is a string representing the abbreviation of the
    :param events: The "events" parameter is a list of event abbreviations. These abbreviations are used to filter the "publication_List" based on the conference event name abbreviation of each publication. Only publications whose conference event name abbreviation matches any of the abbreviations in the "events" list will be included in the
    :return: a filtered list of publications based on the events provided.
    """
    pattern = re.compile(r'(\D+\d+)(?:-\d+)?')

    pubs = [pub for pub in publication_List
            if pattern.match(pub.published_in[0].conference_event_name_abbr).group(1) in events]

    return pubs


def get_available_confs():
    """
    The function `get_available_confs` retrieves a list of available conferences and returns them in a specific format.
    :return: a list of dictionaries, where each dictionary represents a conference. Each dictionary has two key-value pairs: "name" and "label". The "name" key represents the abbreviated name of the conference, while the "label" key represents the display label for the conference. The function also appends a dictionary representing "All Conferences" to the list before returning it.
    """
    confs = Conference.nodes.all()
    conferences = [{"name": conference.conference_name_abbr,
                    "label": conference.conference_name_abbr} for conference in confs]
    conferences.append({
        "name": "All Conferences",
        "label": "All Conferences"
    })

    return conferences


def get_author_pubs_citations_analysis(author_name):
    """
    The function retrieves the publication and citation details for a given author.
    
    :param author_name: The author's name for which you want to retrieve publication and citation analysis
    :return: a list of citation details for each publication of the given author.
    """
    pubs = get_author_publications(author_name)
    data = []
    for pub in pubs:
        citations_detalis = generate_pub_citations_info(pub)
        data.extend(citations_detalis)

    return data


def get_author_pubs_citations_over_time(selectedConferences, author_id):
    """
    The function `get_author_pubs_citations_over_time` returns the citation counts of publications by a specific author over time, filtered by selected conferences.
    
    :param selectedConferences: A list of conference names or abbreviations that the user has selected. It can also contain the string "All Conferences" to indicate that all conferences should be included
    :param author_id: The unique identifier of the author for whom you want to retrieve the publication and citation information
    :return: a list of publication citation counts over time for a given author and selected conferences.
    """
    pubs_counts = []
    pubs = get_author_publications(author_id)

    if "All Conferences" in selectedConferences:
        pubs_counts = get_publications_citation_count(pubs)
    else:
        pubs = [
            pub for pub in pubs
            if pub.published_in_Confs[0].conference_name_abbr
            in selectedConferences]
        pubs_counts = get_publications_citation_count(pubs)

    return pubs_counts


def get_publications_citation_count(author_pubs):
    """
    The function `get_publications_citation_count` takes a list of author publications and returns a dictionary containing data on the citation count and publication count for each year, as well as the conferences the author has published in.
    
    :param author_pubs: The parameter `author_pubs` is a list of publications by a specific author. Each publication in the list is an object that contains information such as the year of publication, the conference event name abbreviation, and the citation count
    :return: a dictionary containing the following keys:
    - "series": a list of dictionaries representing the series data for publications and citations
    - "categories": a list of years representing the x-axis categories
    - "conferences": a set of conference abbreviations
    """

    events_pubs1 = [extract_year(pub.published_in[0].conference_event_name_abbr)
                    for pub in author_pubs]
    counts = Counter(events_pubs1)
    sorted_countes = OrderedDict(sorted(counts.items()))
    publications = list(sorted_countes.values())

    events_pubs = [{"year":  extract_year(pub.published_in[0].conference_event_name_abbr),
                    "citationsCounts": len(ast.literal_eval(pub.citiations))}
                   for pub in author_pubs]

    event_publication_counts = defaultdict(int)
    for item in events_pubs:
        event_publication_counts[item['year']] += item['citationsCounts']

    result = [{'year': event, 'citationsCounts': count}
              for event, count in event_publication_counts.items()]

    data = sorted(result,
                  key=lambda x: x["year"], reverse=False)

    categories = [obj["year"] for obj in data]
    citations_count = [obj["citationsCounts"] for obj in data]

    citations = {"name": "Citations",
                 "type": "line",
                 "data": citations_count}

    publications = {"name": "Publications",
                    "type": "column",
                    "data": publications}

    publicationsConfs = [
        pub.published_in_Confs[0].conference_name_abbr for pub in author_pubs]
    author_pubs = [pub for pub in author_pubs]

    publicationsConfs = set(publicationsConfs)

    final_data = {
        "series": [publications, citations],
        "categories": categories,
        "conferences": publicationsConfs
    }

    return final_data


def extract_year(event):
    """
    The function `extract_year` takes an event string as input and returns the first occurrence of a four-digit year in the string, or None if no year is found.
    
    :param event: The `event` parameter is a string that represents an event
    :return: the first occurrence of a four-digit number in the given event string. If a match is found, the function returns the matched four-digit number as a string. If no match is found, the function returns None.
    """
    match = re.search(r'\d{4}', event)
    return match.group(0) if match else None


def sort_publication_citation_based(authorPublications):
    """
    The function sorts a list of author publications based on the number of citations each publication has.
    
    :param authorPublications: A list of objects representing publications by an author. Each object has the following attributes:
    :return: a list of dictionaries, where each dictionary contains the title and paper ID of a publication, sorted based on the number of citations in descending order.
    """
    pubs = [{"title": pub.title, "paper_id": pub.paper_id, "citations": len(
        ast.literal_eval(pub.citiations))} for pub in authorPublications]
    sorted_pubs = sorted(pubs,
                         key=lambda x: x["citations"], reverse=True)

    pub_title = [{"title": pub["title"], "id": pub["paper_id"]}
                 for pub in sorted_pubs]

    return pub_title


def get_publication_keywords(publication_id):
    """
    The function `get_publication_keywords` retrieves the keywords associated with a publication, along with their corresponding weights.
    
    :param publication_id: The publication_id parameter is the unique identifier of a publication. It is used to retrieve the publication from the database and fetch its associated keywords
    :return: a list of dictionaries, where each dictionary represents a keyword associated with a publication. Each dictionary has two key-value pairs: "text" which represents the keyword text, and "value" which represents the weight of the keyword in relation to the publication.
    """
    data = []
    publicaton = Publication.nodes.get(
        paper_id=publication_id.strip())

    keywords = publicaton.keywords.all()

    keywords = [{"text": keyword.keyword, "value": publicaton.keywords.relationship(keyword).weight}
                for keyword in keywords if keyword.keyword != "none"]

    return keywords


def get_author_interests(author_id):
    """
    The function `get_author_interests` retrieves the interests of an author based on their semantic scholar author ID.
    
    :param author_id: The `author_id` parameter is the unique identifier of the author for whom you want to retrieve the interests
    :return: a dictionary with two keys: "categories" and "series". The value of "categories" is a list of unique years extracted from the data. The value of "series" is a list of dictionaries, where each dictionary represents a keyword and its corresponding data. The "name" key in each dictionary represents the keyword, and the "data" key represents a list of counts
    """
    minimum = 4
    author_node = Author.nodes.filter(
        semantic_scolar_author_id=author_id.strip())

    author_identical_keywords = [
        keyword.keyword for keyword in author_node.keywords.all()]
    publications = author_node.published.all()

    data = [{"keyword": author_keyword, "year": pub.years} for pub in publications for author_keyword in author_identical_keywords if author_keyword in [
        pub_keyword.keyword for pub_keyword in pub.keywords.all()]]

    categories = sorted(list(set([item['year'] for item in data])))
    keyword_counts = defaultdict(lambda: [0]*len(categories))

    for item in data:
        year_index = categories.index(item['year'])
        keyword_counts[item['keyword']][year_index] += 1

    final_data = []
    for keyword, counts in keyword_counts.items():
        final_data.append({'name': keyword, 'data': counts})

    data = {
        "categories": categories,
        "series": final_data
    }

    return data


def get_author_publications_keyword_based(selectedKeyword, author_list):
    """
    The function `get_author_publications_keyword_based` takes a selected keyword and a list of author IDs, and returns a list of publications that are associated with the authors and contain the selected keyword.
    
    :param selectedKeyword: The selected keyword is a string that represents the keyword you want to search for in the publications
    :param author_list: A list of author IDs
    :return: a list of publications that match the selected keyword for each author in the author_list.
    """
    publication_List = []
    for author_id in author_list:
        author_node = Author.nodes.get(
            semantic_scolar_author_id=author_id.strip())
        author_publication_List = author_node.published.all()
        publications = [pub for pub in author_publication_List
                        if selectedKeyword.strip()
                        in [keyword.keyword for keyword in pub.keywords.all()]]
        publication_List.extend(publications)

    return publication_List


def get_author_Conferences(author_Id):
    """
    The function "get_author_Conferences" retrieves the abbreviated names of conferences in which a given author has published.
    
    :param author_Id: The author_Id parameter is the unique identifier of the author in the semantic scholar database
    :return: a list of conference names (abbreviations) that the author with the given author ID has published in.
    """
    authorNode = Author.nodes.get(semantic_scolar_author_id=author_Id)
    authorConfs = [
        conf.conference_name_abbr for conf in authorNode.published_in_Confs]

    return authorConfs
