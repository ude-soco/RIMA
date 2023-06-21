# LK
import pytz
from torch import embedding
from interests.Keyword_Extractor.extractor import getKeyword
from .utils import get_interest_paper_similarity_score, get_vector_representation
from .utils import (
    get_weighted_interest_similarity_score,
    get_single_interest_similarity_score,
)
from .semantic_scholar import SemanticScholarAPI
from interests.update_interests import normalize
import numpy as np
import matplotlib.pyplot as plt

utc = pytz.timezone("UTC")

EMBEDDING = "Transformers"
USER = "user_model"
KEYWORDS = "paper_keywords"
TITLE_ABSTRACT = "paper_title_abstract"
API = SemanticScholarAPI()


def get_recommended_publications_doc_level(interests):
    """function that copmpares user model weighted keywords with full title and abstarct of paper"""

    user_interest_model_dict = {}  # creates a dictionary of user interest model

    limit = 15  # number of papers to retrieve
    for interest in interests:
        user_interest_model_dict[interest["text"]] = interest["weight"]
        # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}

    # Sending Request to API

    response = API.search_papers_by_keyword(user_interest_model_dict.keys(), limit)
    papers = response["data"]
    # specify embedding method
    # embedding = "Transformers"

    # get user vector representation only one time because it is constant
    # data_type = 'user_model'
    # get embedding vector
    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING)

    # print("user vector", user_vector)
    # Extract unique papers according to their IDs and removing papers with no abstarct
    unique_papers = {
        each["paperId"]: each for each in papers if each["abstract"]
    }.values()
    # print('unique_papers', unique_papers)
    # iterating over papers to extract keywords from them and calculate similarity with user interst vector
    papers_with_scores = []
    count = 0
    # embedding = 'SPECTER'
    # data_type = 'paper_title_abstract'
    for paper in unique_papers:
        try:
            # get vector representation for paper
            paper_vector = get_vector_representation(
                TITLE_ABSTRACT, paper, EMBEDDING
            )  # vector shape(1,768)

            # convert vector shape to 768 to match user vector
            paper_vector = np.squeeze(np.asarray(paper_vector))

            # print("paper vector", paper_vector)
            # calculate similarity
            score = (
                get_interest_paper_similarity_score(
                    user_vector, paper_vector, EMBEDDING
                )
                or 0
            ) * 100
            # score = round((get_interest_paper_similarity_score(normalized_user_vector, normalized_paper_vector) or 0) * 100, 2)
            print("score in get recommended papers\n", score)

            if score > 40:
                paper["score"] = np.round(score, 2)
                papers_with_scores.append(paper)
                count += 1
        except:
            continue
    sorted_list = sorted(papers_with_scores, key=lambda k: k["score"], reverse=True)[
        :10
    ]
    # print('count',count)
    # # get the scores of papers to plot the distribution
    # score_key = "score"
    # score_values = [a_dict[score_key][0] for a_dict in sorted_list]
    # plt.hist(score_values)
    # plt.savefig('scibert_doc.png')
    return sorted_list


# Hoda/Jaleh/Tannaz
# def get_recommended_publications(interests):
#     user_interest_model_dict = {}  # creates a dictionary of user interest model
#     paper_dict = {}

#     limit = 15  # number of papers to retrieve
#     for interest in interests:
#         user_interest_model_dict[interest['text']] = interest['weight']
#         # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}
#     # Sending Request to API
#     API = SemanticScholarAPI()
#     # print(user_interest_model_dict.keys())
#     response = API.search_papers_by_keyword(
#         user_interest_model_dict.keys(), limit)
#     papers = response['data']

#     # Extract unique papers according to their IDs and removing papers with no abstarct
#     unique_papers = {each['paperId']: each for each in papers if each['abstract']}.values()

#     # iterating over papers to extract keywords from them and calculate similarity with user interst vector
#     papers_with_scores = []
#     for paper in unique_papers:
#         text = (paper['title'] if paper['title']
#                 else '') + ' ' + paper['abstract']
#         algorithm = 'Yake'
#         extract_keywords_from_paper = getKeyword(text, algorithm, 15)
#         # {'recommender systems based': 1, 'gained significant attention': 1, 'natural language processing': 1, 'deep learning-based recommender': 3,
#         # 'deep learning': 8, 'learning-based recommender systems': 3, 'recommender systems': 5, 'deep learning technology': 2, 'systems based': 1, 'deep': 8}

#         # normalize weights of keywords for paper to be between 1 and 5 and sorting
#         paper_keywords = normalize(extract_keywords_from_paper)
#         paper_keywords = dict(
#             sorted(paper_keywords.items(), key=lambda item: item[1], reverse=True))

#         # Select top 10 keywords - keeping more 5
#         top_ten_keywords = dict(list(paper_keywords.items())[:10])
#         extra_keywords = dict(list(paper_keywords.items())[10:15])

#         # seperating keywords and weights for paper and for user interest
#         keywords_list = list(top_ten_keywords.keys())
#         keywords_weights = list(top_ten_keywords.values())
#         user_interests = list(user_interest_model_dict.keys())
#         user_interests_weights = list(user_interest_model_dict.values())

#         # calculate similarity score
#         score = round((get_weighted_interest_similarity_score(
#             user_interests, keywords_list, user_interests_weights, keywords_weights) or 0) * 100, 2)
#         interest_score = 0
#         interests_similarity = {}
#         keywords_similarity = {}
#         for interest in interests:
#             interest_score = round((get_single_interest_similarity_score(
#                 [interest['text']], keywords_list, interest['weight'], keywords_weights) or 0) * 100, 2)
#             interests_similarity[interest['text']] = interest_score
#             get_similarity_word_by_word(interest, top_ten_keywords, keywords_similarity)

#         # if score > 40:
#         paper["score"] = score
#         paper["paper_keywords"] = top_ten_keywords
#         paper["extra_keywords"] = extra_keywords
#         paper['interests_similarity'] = interests_similarity
#         paper['keywords_similarity'] = keywords_similarity

#         papers_with_scores.append(paper)

#     sorted_list = sorted(papers_with_scores,
#                          key=lambda k: k['score'],
#                          reverse=True)
#     # print('sorted_list',sorted_list)
#     return sorted_list

# keyword Interest similarity-Hoda start
# def get_similarity_word_by_word(interest, top_ten_keywords, keywords_similarity):
#     """Calculate similarity score between interest and whole keywords"""
#     for keyword, weight in top_ten_keywords.items():
#         keyword_score = round((get_weighted_interest_similarity_score(
#                     [interest['text']], [keyword], [interest['weight']], [weight]) or 0) * 100, 2)
#         keyword_score = keyword_score * (weight/5)
#         if not keywords_similarity.__contains__(keyword):
#             keywords_similarity[keyword] = {'data_weight': weight}
#         keywords_similarity[keyword][interest['text']] = {
#                     'score': keyword_score, 'color': ''}
# Hoda end


# TODO: change number of  publication and add argument to the function input
def get_recommended_publications(interests):
    """function that copmpares user model weighted keywords with paper weighted keywords"""

    user_interest_model_dict = {}  # creates a dictionary of user interest model

    limit = 10  # number of papers to be retrieved
    for interest in interests:
        user_interest_model_dict[interest["text"]] = interest["weight"]
        # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}

    # Sending Request to API

    response = API.search_papers_by_keyword(user_interest_model_dict.keys(), limit)
    papers = response["data"]

    # specify embedding method
    # embedding = "Transformers"
    # get user vector representation only one time because it is constant
    # data_type = 'user_model'
    # get embedding vector
    # user_vector = get_weighted_vector_representation(user_interests, user_interests_weights, embedding)
    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING)
    # Extract unique papers according to their IDs and removing papers with no abstarct
    unique_papers = {
        each["paperId"]: each for each in papers if each["abstract"]
    }.values()

    # iterating over papers to extract keywords from them and calculate similarity with user interst vector
    papers_with_scores = []
    count = 0
    # data_type = 'paper_keywords'

    for paper in unique_papers:
        text = (paper["title"] if paper["title"] else "") + " " + paper["abstract"]
        algorithm = "SingleRank"
        extract_keywords_from_paper = getKeyword(text, algorithm, 15)
        # print("\nextract keywords from papers\n", extract_keywords_from_paper)
        # {'recommender systems based': 1, 'gained significant attention': 1, 'natural language processing': 1, 'deep learning-based recommender': 3,
        # 'deep learning': 8, 'learning-based recommender systems': 3, 'recommender systems': 5, 'deep learning technology': 2, 'systems based': 1, 'deep': 8}

        # normalize weights of keywords for paper to be between 1 and 5
        paper_keywords = normalize(extract_keywords_from_paper)
        # print("normalized weighted paper keywords", paper_keywords)

        paper_keywords = dict(
            sorted(paper_keywords.items(), key=lambda item: item[1], reverse=True)
        )

        # Select top 10 keywords - keeping more 5
        top_ten_keywords = dict(list(paper_keywords.items())[:10])
        print("top_ten_keywords ", top_ten_keywords)
        extra_keywords = dict(list(paper_keywords.items())[10:15])
        # get vectorrepresentation for paper
        # keywords_vector = get_weighted_vector_representation(keywords_list, keywords_weights, embedding)
        # keywords_vector = get_vector_representation(data_type, paper_keywords, embedding)
        keywords_vector = get_vector_representation(
            KEYWORDS, top_ten_keywords, EMBEDDING
        )

        # convert vector shape from(1, dim) to (dim) to match user vector
        keywords_vector = np.squeeze(np.asarray(keywords_vector))
        score = (
            get_interest_paper_similarity_score(user_vector, keywords_vector, EMBEDDING)
            or 0
        ) * 100

        # print('score in get recommended papers\n', score)
        # Jaleh's work
        interest_score = 0
        interests_similarity = {}
        keywords_similarity = {}

        for (
            interest
        ) in (
            interests
        ):  # TODO : fix the error in single interests type of loops because interests is a dictionary with text and weight as the keys
            single_interest = {}
            single_interest[interest["text"]] = interest["weight"]
            print("single interest", single_interest)
            interest_vector = get_vector_representation(
                USER, single_interest, EMBEDDING
            )
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

            # Hoda
            # keyword Interest similarity-Hoda
            for keyword, weight in top_ten_keywords.items():
                single_keyword = {}
                single_keyword[keyword] = weight
                keyword_vector = get_vector_representation(
                    KEYWORDS, single_keyword, EMBEDDING
                )

                # convert vector shape from(1, dim) to (dim) to match user vector
                keyword_vector = np.squeeze(np.asarray(keywords_vector))
                keyword_score = np.round(
                    (
                        get_interest_paper_similarity_score(
                            interest_vector, keyword_vector, EMBEDDING
                        )
                        or 0
                    )
                    * 100,
                    2,
                )

                keyword_score = keyword_score * (weight / 5)
                if not keywords_similarity.__contains__(keyword):
                    keywords_similarity[keyword] = {"data_weight": weight}
                keywords_similarity[keyword][interest["text"]] = {
                    "score": keyword_score,
                    "color": "",
                }

        if score > 40:
            paper["paper_keywords"] = top_ten_keywords
            paper["extra_keywords"] = extra_keywords
            paper["interests_similarity"] = interests_similarity
            paper["keywords_similarity"] = keywords_similarity
            paper["score"] = np.round(score, 2)
            papers_with_scores.append(paper)
            count += 1
    # print('count',count)
    sorted_list = sorted(papers_with_scores, key=lambda k: k["score"], reverse=True)[
        :10
    ]
    # # get the scores of papers to plot the distribution
    # score_key = "score"
    # score_values = [a_dict[score_key] for a_dict in sorted_list]
    # plt.hist(score_values)
    # plt.savefig('transformers.png')
    # plt.show()
    # print(score_values)
    return sorted_list


# Hoda/Jaleh/Tannaz
# def get_interest_paper_similarity(data):
#     paper_keywords = data['paper_keywords']

#     # seperating keywords and weights for paper and for user interest
#     keywords_list = list(paper_keywords.keys())
#     keywords_weights = list(paper_keywords.values())
#     user_interest_model_dict = {}
#     for interest in data['interests']:
#         user_interest_model_dict[interest['text']] = interest['weight']
#     user_interests = list(user_interest_model_dict.keys())
#     user_interests_weights = list(user_interest_model_dict.values())

#     score = round((get_weighted_interest_similarity_score(
#         user_interests, keywords_list, user_interests_weights, keywords_weights) or 0) * 100, 2)
#     interest_score = 0
#     interests_similarity = {}
#     for interest in data['interests']:
#         interest_score = round((get_single_interest_similarity_score(
#             [interest['text']], keywords_list, interest['weight'], keywords_weights) or 0) * 100, 2)
#         interests_similarity[interest['text']] = interest_score

#     paper = {}
#     paper["score"] = score
#     paper['interests_similarity'] = interests_similarity
#     return paper


def get_interest_paper_similarity(data):
    paper_keywords = data["paper_keywords"]

    # seperating keywords and weights for paper and for user interest
    # keywords_list = list(paper_keywords.keys())
    # keywords_weights = list(paper_keywords.values())
    user_interest_model_dict = {}
    for interest in data["interests"]:
        user_interest_model_dict[interest["text"]] = interest["weight"]
    # data_type = 'user_model'
    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING)

    # user_interests = list(user_interest_model_dict.keys())
    # user_interests_weights = list(user_interest_model_dict.values())
    # data_type = 'paper_keywords'
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


# Hoda/Jaleh/Tannaz
# def get_keywords_similarities(data):
#     keywords = data['keywords']
#     interests = data['interests']
#     user_interest_model_dict = {}
#     for interest in interests:
#         user_interest_model_dict[interest['text']] = interest['weight']
#     user_interests = list(user_interest_model_dict.keys())
#     user_interests_weights = list(user_interest_model_dict.values())
#     keywords_list = list(keywords.keys())
#     keywords_weights = list(keywords.values())
#     # calculate similarity score
#     score = round((get_weighted_interest_similarity_score(
#         user_interests, keywords_list, user_interests_weights, keywords_weights) or 0) * 100, 2)

#     keyword_score = 0
#     keywords_similarity = {}
#     for keyword in keywords:
#         keyword_score = round((get_single_interest_similarity_score(
#             [keyword], user_interests, keywords[keyword], user_interests_weights) or 0) * 100, 2)
#         keywords_similarity[keyword] = keyword_score

#     paper = {}
#     paper["score"] = score
#     paper['keywords_similarity'] = keywords_similarity
#     return paper


def get_keywords_similarities(data):
    print("data in get_keywords_similarity", data)
    keywords = data["keywords"]
    interests = data["interests"]
    user_interest_model_dict = {}
    for interest in interests:
        user_interest_model_dict[interest["text"]] = interest["weight"]

    # data_type = 'user_model'
    user_vector = get_vector_representation(USER, user_interest_model_dict, EMBEDDING)

    # user_interests = list(user_interest_model_dict.keys())
    # user_interests_weights = list(user_interest_model_dict.values())
    # data_type = 'paper_keywords'
    keywords_vector = get_vector_representation(KEYWORDS, keywords, EMBEDDING)

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

    keyword_score = 0
    keywords_similarity = {}
    for keyword in keywords:
        keyword_vector = get_vector_representation(KEYWORDS, keyword, EMBEDDING)

        # convert vector shape from(1, dim) to (dim) to match user vector
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
