import pytz
from torch import embedding
from interests.Keyword_Extractor.extractor import getKeyword
from ..utils import get_interest_paper_similarity_score, get_vector_representation
from ..utils import (
    get_weighted_interest_similarity_score,
    get_single_interest_similarity_score,
)
from ..semantic_scholar import SemanticScholarAPI
from interests.update_interests import normalize
import numpy as np
import matplotlib.pyplot as plt
from celery import shared_task, group

utc = pytz.timezone("UTC")

KEYPHRASE_EXTRACTION_ALGORITHM = "SingleRank"
EMBEDDING_TECHNIQUE = "Transformers"
USER = "user_model"
KEYWORDS = "paper_keywords"
TITLE_ABSTRACT = "paper_title_abstract"
API = SemanticScholarAPI()


@shared_task()
def process_paper(paper, user_vector, interests):
    '''
    returns
    interests_similarity: List of similarity scores between each user's interest and publication
    score: Similarity score between user's interests and publication
    '''
    user_vector_list = np.array(user_vector)
    text = (paper["title"] if paper["title"] else "") + " " + paper["abstract"]
    extract_keywords_from_paper = getKeyword(text, KEYPHRASE_EXTRACTION_ALGORITHM, 15)
    paper_keywords = normalize(extract_keywords_from_paper)
    paper_keywords = dict(sorted(paper_keywords.items(), key=lambda item: item[1], reverse=True))
    top_ten_keywords = dict(list(paper_keywords.items())[:10])
    extra_keywords = dict(list(paper_keywords.items())[10:15])
    publication_vector = get_vector_representation(KEYWORDS, top_ten_keywords, EMBEDDING_TECHNIQUE)
    publication_vector = np.squeeze(np.asarray(publication_vector))
    # score: Similarity score between user and publication
    score = (get_interest_paper_similarity_score(user_vector_list, publication_vector, EMBEDDING_TECHNIQUE) or 0) * 100
    interest_score = 0
    interests_similarity = {}
    keywords_similarity = {}

    for interest in interests:
        single_interest = {}
        single_interest[interest["text"]] = interest["weight"]
        interest_vector = get_vector_representation(USER, single_interest, EMBEDDING_TECHNIQUE)
        interest_score = np.round((get_interest_paper_similarity_score(interest_vector, publication_vector, EMBEDDING_TECHNIQUE) or 0) * 100, 2)
        interests_similarity[interest["text"]] = interest_score

        for keyword, weight in top_ten_keywords.items():
            single_keyword = {}
            single_keyword[keyword] = weight
            keyword_vector = get_vector_representation(KEYWORDS, single_keyword, EMBEDDING_TECHNIQUE)
            keyword_vector = np.squeeze(np.asarray(publication_vector))
            keyword_score = np.round((get_interest_paper_similarity_score(interest_vector, keyword_vector, EMBEDDING_TECHNIQUE) or 0) * 100, 2)
            keyword_score = keyword_score * (weight / 5)
            if not keywords_similarity.__contains__(keyword):
                keywords_similarity[keyword] = {"data_weight": weight}
            keywords_similarity[keyword][interest["text"]] = {"score": keyword_score, "color": ""}

    if score > 40:
        paper["paper_keywords"] = top_ten_keywords
        paper["extra_keywords"] = extra_keywords
        paper["interests_similarity"] = interests_similarity
        paper["keywords_similarity"] = keywords_similarity
        paper["score"] = np.round(score, 2)
        return paper

def get_recommended_publications_updated(interests):
    user_interest_model_dict = {}
    limit = 10
    for interest in interests:
        user_interest_model_dict[interest["text"]] = interest["weight"]
    response = API.search_papers_by_keyword(user_interest_model_dict.keys(), limit)
    papers = response["data"]
    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING_TECHNIQUE)
    user_vector = user_vector.tolist()  # Convert numpy array to list
    unique_papers = {each["paperId"]: each for each in papers if each["abstract"]}.values()
    tasks = group(process_paper.s(paper, user_vector, interests) for paper in unique_papers)
    results = tasks.apply_async().get()
    papers_with_scores = [result for result in results if result is not None]
    sorted_list = sorted(papers_with_scores, key=lambda k: k["score"], reverse=True)[:10]
    return sorted_list
