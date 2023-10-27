import pytz
from interests.Keyword_Extractor.extractor import getKeyword
from ..utils import get_interest_paper_similarity_score, get_vector_representation
from ..semantic_scholar import SemanticScholarAPI
from interests.update_interests import normalize
import numpy as np
from celery import shared_task, group

utc = pytz.timezone("UTC")

KEYPHRASE_EXTRACTION_ALGORITHM = "SingleRank"
EMBEDDING_TECHNIQUE = "Transformers"
USER = "user_model"
KEYWORDS = "paper_keywords"
TITLE_ABSTRACT = "paper_title_abstract"
API = SemanticScholarAPI()


@shared_task()
def process_publication(paper, user_interest_model_vector, user_interest_model):
    """
    returns
    interests_similarity: List of similarity scores between each user's interest and publication
    score: Similarity score between user's interests and publication
    """
    user_interest_model_vector_list = np.array(user_interest_model_vector)
    text = (paper["title"] if paper["title"] else "") + " " + paper["abstract"]

    publication_keywords = getKeyword(text, KEYPHRASE_EXTRACTION_ALGORITHM, 15)

    normalized_publication_keywords = normalize(publication_keywords)
    sorted_publication_keywords = dict(
        sorted(
            normalized_publication_keywords.items(),
            key=lambda item: item[1],
            reverse=True,
        )
    )

    top_ten_publication_keywords = dict(list(sorted_publication_keywords.items())[:10])
    bottom_five_publication_keywords = dict(
        list(sorted_publication_keywords.items())[10:15]
    )

    publication_vector = get_vector_representation(
        KEYWORDS, top_ten_publication_keywords, EMBEDDING_TECHNIQUE
    )
    publication_vector = np.array(publication_vector.tolist())

    score = (
        get_interest_paper_similarity_score(
            user_interest_model_vector_list, publication_vector, EMBEDDING_TECHNIQUE
        )
        or 0
    ) * 100

    interest_score = 0
    interests_similarity = {}
    publication_keywords_similarity = {}

    if score > 40:
        for interest in user_interest_model:
            single_interest = {}
            single_interest[interest["text"]] = interest["weight"]
            interest_vector = get_vector_representation(
                USER, single_interest, EMBEDDING_TECHNIQUE
            )
            interest_score = np.round(
                (
                    get_interest_paper_similarity_score(
                        interest_vector, publication_vector, EMBEDDING_TECHNIQUE
                    )
                    or 0
                )
                * 100,
                2,
            )
            interests_similarity[interest["text"]] = interest_score

            for keyword, weight in top_ten_publication_keywords.items():
                single_keyword = {}
                single_keyword[keyword] = weight
                publication_keyword_vector = get_vector_representation(
                    KEYWORDS, single_keyword, EMBEDDING_TECHNIQUE
                )
                # keyword_vector = np.squeeze(np.asarray(publication_vector))
                publication_keyword_vector = np.array(
                    publication_keyword_vector.tolist()
                )
                publication_keyword_score = np.round(
                    (
                        get_interest_paper_similarity_score(
                            interest_vector,
                            publication_keyword_vector,
                            EMBEDDING_TECHNIQUE,
                        )
                        or 0
                    )
                    * 100,
                    2,
                )
                publication_keyword_score = publication_keyword_score * (weight / 5)
                if not publication_keywords_similarity.__contains__(keyword):
                    interest_model_publication_keyword_score = np.round(
                        (
                            get_interest_paper_similarity_score(
                                user_interest_model_vector_list,
                                publication_keyword_vector,
                                EMBEDDING_TECHNIQUE,
                            )
                            or 0
                        )
                        * 100,
                        2,
                    )
                    publication_keywords_similarity[keyword] = {
                        "data_weight": weight,
                        "data_interest_model_publication_keyword_score": interest_model_publication_keyword_score,
                    }
                publication_keywords_similarity[keyword][interest["text"]] = {
                    "score": publication_keyword_score,
                    "color": "",
                }

        paper["paper_keywords"] = top_ten_publication_keywords
        paper["extra_keywords"] = bottom_five_publication_keywords
        paper["interests_similarity"] = interests_similarity
        paper["keywords_similarity"] = publication_keywords_similarity
        paper["score"] = np.round(score, 2)
        return paper


def get_recommended_publications_updated(user_interest_model, limit=10):
    user_interest_model_dict = {}
    for interest in user_interest_model:
        user_interest_model_dict[interest["text"]] = interest["weight"]
    response = API.search_papers_by_keyword(user_interest_model_dict.keys(), limit)
    papers = response["data"]
    new_papers = []
    for p in papers:
        abstract = p["abstract"]
        if abstract == None:
            new_papers.append(p)
            continue
        elif len(abstract.split(" ")) > 300:
            lst_abstract = [w.lower() for w in abstract.split(" ")]
            try:
                i = lst_abstract.index("introduction")
                lst_abstract = abstract.split(" ")[:i]
                abstract = " ".join(lst_abstract)
                p["abstract"] = abstract
                new_papers.append(p)

            except:
                if len(abstract.split(" ")) > 1000:
                    lst_abstract = abstract.split(" ")[:300]
                    abstract = " ".join(lst_abstract)
                    p["abstract"] = abstract
                new_papers.append(p)
        else:
            new_papers.append(p)

    user_interest_model_vector = get_vector_representation(
        USER, user_interest_model_dict, EMBEDDING_TECHNIQUE
    )
    user_interest_model_vector = user_interest_model_vector.tolist()
    unique_papers = {
        each["paperId"]: each for each in new_papers if each["abstract"]
    }.values()
    tasks = group(
        process_publication.s(paper, user_interest_model_vector, user_interest_model)  # type: ignore
        for paper in unique_papers
    )
    results = tasks.apply_async().get()
    papers_with_scores = [result for result in results if result is not None]
    sorted_list = sorted(papers_with_scores, key=lambda k: k["score"], reverse=True)[
        :10
    ]
    return sorted_list
