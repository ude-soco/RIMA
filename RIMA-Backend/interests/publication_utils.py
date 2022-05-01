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
        for interest in interests: 
            interest_score = round((get_single_interest_similarity_score(
                [interest['text']],keywords_list,interest['weight'],keywords_weights)or 0)* 100,2)
            interests_similarity[interest['text']] = interest_score
        
        # if score > 40:
        paper["score"] = score
        paper["paper_keywords"] = paper_keywords
        paper['interests_similarity'] = interests_similarity

        papers_with_scores.append(paper)


    sorted_list = sorted(papers_with_scores,
                         key=lambda k: k['score'],
                         reverse=True)
    # print('sorted_list',sorted_list)
    return sorted_list

def get_interest_paper_similarity(data):
    paper_keywords = data['paper_keywords']

    # seperating keywords and weights for paper and for user interest
    keywords_list = list(paper_keywords.keys())
    keywords_weights = list(paper_keywords.values())
    user_interest_model_dict = []
    print('interests',data['interests'])
    for interest in data['interests']: 
        user_interest_model_dict[interest['text']] = interest['weight']
    user_interests = list(user_interest_model_dict.keys())
    user_interests_weights = list(user_interest_model_dict.values())
    print('user_interests',user_interests)
    print('user_interests_weights',user_interests_weights)

    # calculate similarity score
    score = round((get_weighted_interest_similarity_score(
            user_interests, keywords_list, user_interests_weights, keywords_weights ) or 0) * 100, 2)
    interest_score = 0
    interests_similarity = {}
    for interest in data['interests']: 
        interest_score = round((get_single_interest_similarity_score(
            [interest['text']],keywords_list,interest['weight'],keywords_weights)or 0)* 100,2)
        interests_similarity[interest['text']] = interest_score
    
    paper=[]
    paper["score"] = score
    paper['interests_similarity'] = interests_similarity
    return paper



def get_keyword_similarities(data):
    keywords = data['keywords']
    interests = data['interests']
    user_interest_model_dict={}
    for interest in interests: 
        user_interest_model_dict[interest['text']] = interest['weight'] 
    user_interests = list(user_interest_model_dict.keys())
    user_interests_weights = list(user_interest_model_dict.values())
    keywords_keys = list(keywords.keys())
    keyword_score = 0
    keywords_similarities = {}
    for key in keywords_keys: 
        keyword_score = round((get_single_interest_similarity_score(
            [key],user_interests,keywords[key],user_interests_weights)or 0)* 100,2)
        keyword_interests_score = {}
        score = 0
        for doc_key in user_interests:
            score = round((get_single_interest_similarity_score(
            [key],[doc_key],[keywords[key]],[user_interests[doc_key]])or 0)* 100,2)
            keyword_interests_score = {'name':doc_key,'y':score,'color':interest['color']}
        keywords_similarities = {"name":key,"score":keyword_score,"interests":keyword_interests_score}
            
    print(keyword_interests_score)
    return keywords_similarities