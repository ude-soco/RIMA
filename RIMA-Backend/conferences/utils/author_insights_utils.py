from conferences.models.graph_db_entities import *
from collections import defaultdict
from collections import OrderedDict
from collections import Counter
import ast
import re


def get_author_network(author_id):
    all_authors = []
    author = Author.nodes.filter(semantic_scolar_author_id=author_id)
    author_nodes = author.co_authors.all()

    author_nodes.extend(author)
    return handle_coauthor_data(author_nodes)


def get_event_coauthor_data(event):
    author_nodes = event.authors.all()

    return handle_coauthor_data(author_nodes)


def handle_coauthor_data(author_nodes):
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


def get_author_pubs_overYears(author_id):
    author_node = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()

    pubs_counst = get_publications_with_years_event_based(author_pubs)

    return pubs_counst


def filter_publication_basedOn_confs(author_id, selectedConfs):
    author_node = Author.nodes.get_or_none(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()

    filtered_pubs = [pub for pub in author_pubs if pub.published_in_Confs[0].conference_name_abbr.strip()
                     in selectedConfs]

    pubs_counst = get_publications_with_years_event_based(filtered_pubs)
    return pubs_counst


def get_publications_with_years_conf_based(author_pubs):
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
    author_node = Author.nodes.filter(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()
    return author_pubs


def get_event_author_set_VennDiagram(event_name):
    event_authors_list = []
    event_node = Event.nodes.filter(conference_event_name_abbr=event_name)
    author_nodes = (event_node.authors.all())
    for author_node in author_nodes:
        event_authors_list.append(author_node.author_name)

    return set(event_authors_list)


def get_author_detailed_info(author_id):
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
    events = Event.nodes.all()
    return events


def getAllAuthors(conferences):
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


def get_Most_Published_authors(conferences):
    data = []
    if "All Conferences" in conferences:
        allAuthors = Author.nodes.all()
        data = sort_authors(allAuthors)

    else:
        all_authors = []
        print("conferences", conferences)
        for conf in conferences:
            print("conf: ", conf)
            authors = Conference.nodes.filter(
                conference_name_abbr=conf).authors
            all_authors.extend(authors)

        data = sort_authors(all_authors)

    return data


def sort_authors(authors):
    author_pubs_counts = [{"label": author.semantic_scolar_author_id,
                           "name": author.author_name,
                           "count": len(author.published.all())} for author in authors]
    data = sorted(author_pubs_counts,
                  key=lambda x: x["count"], reverse=True)

    author_dict = {author["label"]: author for author in data}
    data = list(author_dict.values())

    return data


def get_Author_Pubs_InYear(author_id, pub_year):
    author_node = Author.nodes.filter(
        semantic_scolar_author_id=author_id.strip())
    author_pubs = author_node.published.all()

    pubs = [publication for publication in author_pubs
            if publication.years == pub_year.strip()]

    return pubs


def get_Author_Pubs_By_keyword_InYear(author_id, keyword, pub_year):
    pubs = get_Author_Pubs_InYear(author_id, pub_year)
    print("publications: ", pubs)
    pubs = [pub for pub in pubs if keyword in [
        keyword.keyword for keyword in pub.keywords.all()]]

    return pubs


def filter_publication_basedOn_Events(publication_List, events):
    pattern = re.compile(r'(\D+\d+)(?:-\d+)?')

    pubs = [pub for pub in publication_List
            if pattern.match(pub.published_in[0].conference_event_name_abbr).group(1) in events]

    return pubs


def get_available_confs():
    confs = Conference.nodes.all()
    conferences = [{"name": conference.conference_name_abbr,
                    "label": conference.conference_name_abbr} for conference in confs]
    conferences.append({
        "name": "All Conferences",
        "label": "All Conferences"
    })

    return conferences


def get_Author_Pubs_Citations_Analysis(author_name):
    pubs = get_author_publications(author_name)
    data = []
    for pub in pubs:
        citations_detalis = generate_pub_citations_info(pub)
        data.extend(citations_detalis)

    print("ciatation detailss : ", data)
    return data


def get_Author_Pubs_Citations_OverTime(selectedConferences, author_id):
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
    print("get_publications_with_years_event_based2 called")

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
    match = re.search(r'\d{4}', event)
    return match.group(0) if match else None


def sort_publication_citation_based(authorPublications):
    pubs = [{"title": pub.title, "paper_id": pub.paper_id, "citations": len(
        ast.literal_eval(pub.citiations))} for pub in authorPublications]
    sorted_pubs = sorted(pubs,
                         key=lambda x: x["citations"], reverse=True)

    pub_title = [{"title": pub["title"], "id": pub["paper_id"]}
                 for pub in sorted_pubs]

    return pub_title


def get_publication_keywords(publication_id):
    data = []
    publicaton = Publication.nodes.get(
        paper_id=publication_id.strip())

    keywords = publicaton.keywords.all()

    keywords = [{"text": keyword.keyword, "value": publicaton.keywords.relationship(keyword).weight}
                for keyword in keywords if keyword.keyword != "none"]

    print("keyword with weight: ", keywords)
    return keywords


def get_author_interests(author_id):
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

    print("***********************************************************************************")
    print(data)
    print("***********************************************************************************")
    return data


def get_author_publications_keyword_based(selectedKeyword, author_list):
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
    authorNode = Author.nodes.get(semantic_scolar_author_id=author_Id)
    authorConfs = [
        conf.conference_name_abbr for conf in authorNode.published_in_Confs]

    return authorConfs
