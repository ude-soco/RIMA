#LK
import pytz
import os
import random
from tweepy.parsers import JSONParser
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikifilter
from .utils import get_interest_similarity_score
from .semantic_scholar import SemanticScholarAPI
from interests.update_interests import normalize
utc = pytz.timezone('UTC')

API = SemanticScholarAPI()


def get_recommended_publications(interests):
    user_interest_model_dict = {}  # creates a dictionary of user interest model
    paper_dict = {}
    
    limit = 50 # number of papers to retrieve
    for interest in interests: 
        user_interest_model_dict[interest['text']] = interest['weight'] 
        # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}
    
    # Sending Request to API
    API = SemanticScholarAPI()
    response = API.search_papers_by_keyword(
        user_interest_model_dict.keys(), limit)
    papers = response['data']

    
    # Extract unique papers according to their IDs and removing papers with no abstarct
    unique_papers = {each['paperId']: each for each in papers if each['abstract']}.values()
    
    # iterating over papers to extract keywords from them and calculate similarity with user interst vector
    papers_with_scores = []
    for paper in unique_papers:
        text = (paper['title'] if paper['title'] else '') + ' ' + paper['abstract']
        algorithm = 'SingleRank'
        extract_keywords_from_paper = getKeyword(text, algorithm)
        # print(extract_keywords_from_paper)
        #{'recommender systems based': 1, 'gained significant attention': 1, 'natural language processing': 1, 'deep learning-based recommender': 3,
        # 'deep learning': 8, 'learning-based recommender systems': 3, 'recommender systems': 5, 'deep learning technology': 2, 'systems based': 1, 'deep': 8}

        # normalize weights of keywords for paper to be between 1 and 5 
        paper_keywords = normalize(extract_keywords_from_paper)
        print("normalized weighted paper keywords", paper_keywords)
        # seperating keywords and weights for paper and for user interest
        keywords_list = list(paper_keywords.keys())
        keywords_weights = list(paper_keywords.values())
        user_interests = list(user_interest_model_dict.keys())
        user_interests_weights = list(user_interest_model_dict.values())

        # calculate similarity score
        score = round((get_interest_similarity_score(
                user_interests, keywords_list, user_interests_weights, keywords_weights, ) or 0) * 100, 2)

        
        if score > 40:
            paper["score"] = score
            papers_with_scores.append(paper)

    sorted_list = sorted(papers_with_scores,
                         key=lambda k: k['score'],
                         reverse=True)
    return sorted_list

