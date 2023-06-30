from conferences.models.graph_db_entities import *
from collections import defaultdict


def get_event_coauthor_data(event_name):
    event_authors_list = []
    all_author_couthors_list = []
    event_node = Event.nodes.filter(conference_event_name_abbr=event_name)
    author_nodes = event_node.authors.all()
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


def get_event_author_set_VennDiagram(event_name):
    event_authors_list = []
    event_node = Event.nodes.filter(conference_event_name_abbr=event_name)
    author_nodes = (event_node.authors.all())
    for author_node in author_nodes:
        event_authors_list.append(author_node.author_name)

   
    return set(event_authors_list)


def get_author_detailed_info(author_id):
    author_data = []
    author_node = Author.nodes.filter(semantic_scolar_author_id=author_id)
    author_keywords = author_node.keywords.all()
    author_interests = author_node.topics.all()
    # author_coauthor_network = create_coauthor_links(author_node)
    author_publication_links = create_author_publication_links(author_node)
    author_data.append({
        "author name": author_node.author_name,
        "publication counts": len(author_node.all_papers),
        "Author publications": author_publication_links,
        "semantic scolar author id": author_node.semantic_scolar_author_id,
        "author url": author_node.author_url,
        "author keywords": author_keywords,
        "author interests": author_interests,
        # "coauthor network": author_coauthor_network
    })


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
            "author name": author_node.author_name,
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
    citations = publication_node.citiations
    publication_citations_detailed_info = []
    for obj in citations:
        publication_citations_detailed_info.append(
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
    return publication_citations_detailed_info


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