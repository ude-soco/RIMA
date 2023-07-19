import pytz
from .utils import get_interest_paper_similarity_score, get_vector_representation

from .semantic_scholar import SemanticScholarAPI
import numpy as np
import matplotlib.pyplot as plt

utc = pytz.timezone("UTC")

EMBEDDING = "Transformers"
USER = "user_model"
KEYWORDS = "paper_keywords"
TITLE_ABSTRACT = "paper_title_abstract"
API = SemanticScholarAPI()


def get_interest_paper_similarity(data):
    paper_keywords = data["paper_keywords"]

    user_interest_model_dict = {}
    for interest in data["interests"]:
        user_interest_model_dict[interest["text"]] = interest["weight"]
    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING)

    keywords_vector = get_vector_representation(KEYWORDS, paper_keywords, EMBEDDING)

    # convert vector shape from(1, dim) to (dim) to match user vector
    keywords_vector = np.squeeze(np.asarray(keywords_vector))

    score = np.round(
        (
            get_interest_paper_similarity_score(user_vector, keywords_vector, EMBEDDING)
            or 0
        )
        * 100,
        2,
    )
    interest_score = 0
    interests_similarity = {}

    for interest in data["interests"]:
        single_interest = {}
        single_interest[interest["text"]] = interest["weight"]
        interest_vector = get_vector_representation(USER, single_interest, EMBEDDING)
        interest_score = np.round(
            (
                get_interest_paper_similarity_score(
                    interest_vector, keywords_vector, EMBEDDING
                )
                or 0
            )
            * 100,
            2,
        )
        interests_similarity[interest["text"]] = interest_score

    paper = {}
    paper["score"] = score
    paper["interests_similarity"] = interests_similarity
    return paper


def get_keywords_similarities(data):
    print("data in get_keywords_similarity", data)
    keywords = data["keywords"]
    interests = data["interests"]
    user_interest_model_dict = {}
    for interest in interests:
        user_interest_model_dict[interest["text"]] = interest["weight"]

    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING)

    keywords_vector = get_vector_representation(KEYWORDS, keywords, EMBEDDING)

    keywords_vector = np.squeeze(np.asarray(keywords_vector))

    score = np.round(
        (
            get_interest_paper_similarity_score(user_vector, keywords_vector, EMBEDDING)
            or 0
        )
        * 100,
        2,
    )

    keyword_score = 0
    keywords_similarity = {}
    for keyword in keywords:
        keyword_vector = get_vector_representation(KEYWORDS, keyword, EMBEDDING)

        keyword_vector = np.squeeze(np.asarray(keywords_vector))
        keyword_score = np.round(
            (
                get_interest_paper_similarity_score(
                    user_vector, keyword_vector, EMBEDDING
                )
                or 0
            )
            * 100,
            2,
        )
        keywords_similarity[keyword] = keyword_score

    paper = {}
    paper["score"] = score
    paper["keywords_similarity"] = keywords_similarity
    return paper
