#LK
import pytz
import os
import random
import numpy as np
from tweepy.parsers import JSONParser
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikifilter
from .utils import get_weighted_interest_similarity_score,get_single_interest_similarity_score
from .semantic_scholar import SemanticScholarAPI
from interests.update_interests import normalize

utc = pytz.timezone('UTC')

API = SemanticScholarAPI()


def get_recommended_papers(interests):
    user_interest_model_dict = {}  # creates a dictionary of user interest model
    paper_dict = {}
    
    limit = 15 # number of papers to retrieve
    for interest in interests: 
        user_interest_model_dict[interest['text']] = interest['weight'] 
        # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}
    # Sending Request to API
    API = SemanticScholarAPI()
    # print(user_interest_model_dict.keys())
    response = API.search_papers_by_keyword(user_interest_model_dict.keys(), limit)
    papers = response['data']

    
    # Extract unique papers according to their IDs and removing papers with no abstarct
    unique_papers = {each['paperId']: each for each in papers if each['abstract']}.values()
    
    # iterating over papers to extract keywords from them and calculate similarity with user interst vector
    papers_with_scores = []
    for paper in unique_papers:
        text = (paper['title'] if paper['title'] else '') + ' ' + paper['abstract']
        algorithm = 'Yake'
        extract_keywords_from_paper = getKeyword(text, algorithm)
        #{'recommender systems based': 1, 'gained significant attention': 1, 'natural language processing': 1, 'deep learning-based recommender': 3,
        # 'deep learning': 8, 'learning-based recommender systems': 3, 'recommender systems': 5, 'deep learning technology': 2, 'systems based': 1, 'deep': 8}

        # normalize weights of keywords for paper to be between 1 and 5 
        paper_keywords = normalize(extract_keywords_from_paper)

        # seperating keywords and weights for paper and for user interest
        keywords_list = list(paper_keywords.keys())
        keywords_weights = list(paper_keywords.values())
        user_interests = list(user_interest_model_dict.keys())
        user_interests_weights = list(user_interest_model_dict.values())

        # calculate similarity score
        score = round((get_weighted_interest_similarity_score(
                user_interests, keywords_list, user_interests_weights, keywords_weights ) or 0) * 100, 2)
        interest_score = 0
        interests_similarity = {}
        sum_interests_weights = np.sum(user_interests_weights)
        for interest in interests: 
            interest_score = round((get_single_interest_similarity_score(
                [interest['text']],keywords_list,interest['weight'],keywords_weights,sum_interests_weights)or 0)* 100,2)
            interests_similarity[interest['text']] = interest_score
        
        
        
        if score > 40:
<<<<<<< HEAD
            interest_score = 0
            interests_similarity = {}
            keywords_similarity={}
            sum_interests_weights = np.sum(user_interests_weights)
            for interest in interests: 
                interest_score = round((get_single_interest_similarity_score(
                    [interest['text']],keywords_list,interest['weight'],keywords_weights,sum_interests_weights)or 0)* 100,2)
                interests_similarity[interest['text']] = interest_score
                #keyword Interest similarity-Hoda    
                for keyword,weight in paper_keywords.items():
                    keyword_score = round((get_weighted_interest_similarity_score(
                        [interest['text']],[keyword],[interest['weight']],[weight])or 0)* 100,2)
                    keyword_score=keyword_score* (weight/5)
                    if not keywords_similarity.__contains__(keyword):
                        keywords_similarity[keyword]={}    
                    keywords_similarity[keyword][interest['text']]={'score':keyword_score,'color':''}

=======
>>>>>>> parent of 6de9c3f (Highlighting abstract)
            paper["score"] = score
            paper["paper_keywords"] = paper_keywords
            paper['interests_similarity'] = interests_similarity

            




            papers_with_scores.append(paper)


    sorted_list = sorted(papers_with_scores,
                         key=lambda k: k['score'],
                         reverse=True)
    # print('sorted_list',sorted_list)
    return sorted_list

# def get_interest_paper_similarity(interest,interest_weight,total_weight,compaer)