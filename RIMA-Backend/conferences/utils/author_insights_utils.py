from conferences.models.graph_db_entities import *


def get_event_coauthor_data(event_name):
    event_authors_list = []
    all_author_couthors_list = []
    event_node = Event.nodes.filter(conference_event_name_abbr=event_name)
    author_nodes = event_node.authors.all()
    for author_node in author_nodes:
        event_authors_list.append({
            "id": author_node.semantic_scolar_author_id,
            "label": author_node.author_name
        })
        author_couthors_list = create_coauthor_links(
            author_node)


def get_author_detailed_info(author_id):
    author_data = []
    author_node = Author.nodes.filter(semantic_scolar_author_id=author_id)
    author_keywords = author_node.keywords.all()
    author_interests = author_node.topics.all()
    author_coauthor_network = create_coauthor_links(author_node)
    author_publication_links = create_author_publication_links(author_node)
    author_data.append({
        "author name": author_node.author_name,
        "publication counts": len(author_node.all_papers),
        "Author publications": author_publication_links,
        "semantic scolar author id": author_node.semantic_scolar_author_id,
        "author url": author_node.author_url,
        "author keywords": author_keywords,
        "author interests": author_interests,
        "coauthor network": author_coauthor_network
    })


def create_coauthor_links(author_node):
    """
    Generates a list of dictionaries containing information about an author's co-authors.

    Args:
        author_node (object): An author node object.

    Returns:
        list: A list of dictionaries, where each dictionary contains two key-value pairs: "source_id" (with the value set
                to the author node's semantic_scolar_author_id property) and "target_id" (with the value set to a co-author's
                semantic_scolar_author_id property).
    """
    co_author_nodes = author_node.co_authors.all()
    all_author_couthors_list = []
    for co_author in co_author_nodes:
        all_author_couthors_list.append({
            "source_id": author_node.semantic_scolar_author_id,
            "target_id": co_author.semantic_scolar_author_id
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