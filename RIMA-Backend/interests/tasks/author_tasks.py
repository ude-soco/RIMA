import datetime
import pytz
from accounts.models import User
from interests.models import Paper, Author, Citation
from interests.utils.interest_utils import fetch_papers_keywords
from interests.utils.author_utils import generate_authors_interests

from celery.decorators import task
from common.config import BaseCeleryTask

from ..semantic_scholar import SemanticScholarAPI
from collections import Counter


@task(
    name="getConnectedAuthorsData",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def getConnectedAuthorsData(user_author_id, number_of_top_connected_authors):
    """
    Gets the ids of the top authors connected to a user
    
    Parameters
    ----------
    user_author_id : string
        The id of the user on semantic scholar
    number_of_top_connected_authors:
        The number of connected authors that should be returned

    Output
    --------
    Returns a dictionary that has "cited_by" and "referenced" keys
    each of "cited_by" and "referenced" is linked to a list of tupels 
    each tuple represnte the name of the author, his/ her id and the number of times s/he cited / was referenced by the user
    """

    # citations
    print("get most authors who cited me the most")
    allCitsRefs=getRefCitAuthorsPapers(authorId=user_author_id, method="citations")
    listAuthors = allCitsRefs["listAllAuthors"]
    dictAuthorsName = allCitsRefs["authorsNames"]
    top_cited_by_authors = list(Counter(listAuthors).most_common(number_of_top_connected_authors))

    top_cited_by_with_names = []
    for author_id, count in top_cited_by_authors:
        author_name_list = dictAuthorsName.get(author_id, [])
        if len(author_name_list) > 0:
            author_name = author_name_list[0]
            top_cited_by_with_names.append((author_id, author_name, count))


    #references
    print("get authors Who I cited the most")
    allCitsRefs=getRefCitAuthorsPapers(authorId=user_author_id, method="references")
    listAuthors = allCitsRefs["listAllAuthors"]
    dictAuthorsName = allCitsRefs["authorsNames"]
    top_referenced_authors = list(Counter(listAuthors).most_common(number_of_top_connected_authors))

    top_referenced_with_names = []
    for author_id, count in top_referenced_authors:
        author_name_list = dictAuthorsName.get(author_id, [])
        if len(author_name_list) > 0:
            author_name = author_name_list[0]
            top_referenced_with_names.append((author_id, author_name, count))
    
    data={"cited_by":top_cited_by_with_names, "references":top_referenced_with_names}
    return data

@task(
    name="getRefCitAuthorsPapers",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def getRefCitAuthorsPapers(authorId, method):
    results={"listAllAuthors":[]}
    dictAuthorsNames={}

    api=SemanticScholarAPI()
    if method in ["citations", "references"]:
        data=api.citations_references(id=authorId, method=method)
    else:
        print("expected method to be either citations or references")


    for paper in data:
        for m in paper[method]:
            if len(m["authors"]) != 0:
                if authorId not in m["authors"]:
                    for author in m["authors"]:
                        if author["authorId"]!=None:
                            if author["authorId"]!=authorId:
                                listAuthors=results["listAllAuthors"]
                                listAuthors.append(author["authorId"])
                                results["listAllAuthors"]=listAuthors
                                if author["authorId"] in results:
                                    papers=[]
                                    papers=results[author["authorId"]]
                                    papers.append(m["paperId"])

                                    results[author["authorId"]]=papers
                                else:
                                    results[author["authorId"]]=[m["paperId"]]
                                    dictAuthorsNames[author["authorId"]]=[author["name"]]

    results["authorsNames"]=dictAuthorsNames
    return results

def store_connections_to_authors(user_id):
    user= User.objects.get(id= user_id)
    # This function stores the connection of the connected authors to a particulare user in the database
    connected_authors = getConnectedAuthorsData(user.author_id, 3)
    cited_by_authors= connected_authors["cited_by"]
    referenced_authors = connected_authors["references"]
    # save them as Authors in the database and connect them in the citations table to the user
    for author_data in cited_by_authors:
        author_id = author_data[0]
        author_name = author_data[1]
        value = author_data[2]
        # add author to Authors table if not exist
        author, created = Author.objects.get_or_create(author_id=author_id, defaults={"name": author_name, "papers_fetched": False})
        # link author to user in Citations table
        citation, created = Citation.objects.get_or_create(user=user, author=author, relation=Citation.CITED_BY, defaults={"value": value})
        if not created:
            citation.weight = value
            citation.save()
        
    for author_data in referenced_authors:
        author_id = author_data[0]
        author_name = author_data[1]
        value = author_data[2]
        # add author to Authors table if not exist
        author, created = Author.objects.get_or_create(author_id=author_id, defaults={"name": author_name, "papers_fetched": False})
        # link author to user in Citations table
        citation, created = Citation.objects.get_or_create(user=user, author=author, relation=Citation.REFERENCES, defaults={"value": value})
        if not created:
            citation.value = value
            citation.save()
    return

def import_authors_papers(user_id):
    # This functions gets the papers for all the authors that are connected to the user in the attributes
    user = User.objects.get(id=user_id)
    authors = Author.objects.filter(author_citations__user=user)
    current_year = datetime.datetime.now().year
    start_year = current_year - 4  # Collecting papers from the past 5 years, including the current year
    api = SemanticScholarAPI()
    for author in authors:
        publications = api.get_user_publications(User(author_id= author.author_id), start_year, current_year)
        for paper in publications:
            paper_object, created= Paper.objects.get_or_create(
                paper_id=paper.get("paperId", ""),
                defaults={
                "title": paper.get("title", ""),
                "url": paper.get("url", ""),
                "year": paper.get("year"),
                "abstract": paper.get("abstract"),
                "authors": ",".join(
                    list(map(lambda p: p["name"], paper.get("authors", [])))
                ),
                })
            if created:
                # if a new paper was found for that author, it means that his/her interests needs to be recalculated
                author.interests_generated = False
            paper_object.author.add(author)
        author.papers_fetched = True
        author.save()
    return

def fetch_authors_papers_keywords(user_id):
    user = User.objects.get(id= user_id)
    authors = Author.objects.filter(author_citations__user=user)
    if authors:
        paper_candidates = Paper.objects.filter(author__in=authors, used_in_calc=False)
        fetch_papers_keywords(paper_candidates)
    return

#TODO: Enhancement: divide the extraction mechanism into multi threads
@task(
    name="import_user_citation_data",
    base=BaseCeleryTask,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 5, "countdown": 30 * 60},
)
def import_user_citation_data(user_id):
            store_connections_to_authors(user_id) #done    
            import_authors_papers(user_id) #done
            fetch_authors_papers_keywords(user_id)
            generate_user_authors_interests(user_id)

def generate_user_authors_interests(user_id):
    generate_authors_interests(user_id)
    return