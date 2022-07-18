#LK
import pytz
from torch import embedding
from interests.Keyword_Extractor.extractor import getKeyword
from .utils import get_interest_paper_similarity_score, get_vector_representation
from .semantic_scholar import SemanticScholarAPI
from interests.update_interests import normalize
import numpy as np
import matplotlib.pyplot as plt
utc = pytz.timezone('UTC')



API = SemanticScholarAPI()

def get_recommended_publications_doc_level(interests):
    
    ''' function that copmpares user model weighted keywords with full title and abstarct of paper'''

    user_interest_model_dict = {}  # creates a dictionary of user interest model
    
    
    limit = 50 # number of papers to retrieve
    for interest in interests: 
        user_interest_model_dict[interest['text']] = interest['weight'] 
        # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}
    
    # Sending Request to API
    
    response = API.search_papers_by_keyword(
        user_interest_model_dict.keys(), limit)
    papers = response['data']
    # specify embedding method
    embedding = "Transformers"

    # get user vector representation only one time because it is constant
    data_type = 'user_model'
    # get embedding vector
    user_vector = get_vector_representation(data_type, user_interest_model_dict, embedding)


    # print("user vector", user_vector)
    # Extract unique papers according to their IDs and removing papers with no abstarct
    unique_papers = {each['paperId']: each for each in papers if each['abstract']}.values()
    # print('unique_papers', unique_papers)
    # iterating over papers to extract keywords from them and calculate similarity with user interst vector
    papers_with_scores = []
    count = 0 
    # embedding = 'SPECTER'
    data_type = 'paper_title_abstract'
    for paper in unique_papers:
       
        try:
            # get vector representation for paper
            paper_vector = get_vector_representation(data_type, paper, embedding) # vector shape(1,768)

            #convert vector shape to 768 to match user vector
            paper_vector = np.squeeze(np.asarray(paper_vector))

            # print("paper vector", paper_vector)
            #calculate similarity
            score = (get_interest_paper_similarity_score(user_vector,paper_vector, embedding) or 0) * 100
            # score = round((get_interest_paper_similarity_score(normalized_user_vector, normalized_paper_vector) or 0) * 100, 2)
            print('score in get recommended papers\n', score)
            
            if score > 40:
                paper["score"] = np.round(score,2)
                papers_with_scores.append(paper)
                count+=1
        except:
            continue
    sorted_list = sorted(papers_with_scores,
                         key=lambda k: k['score'],
                         reverse=True)[:10]
    # print('count',count)
    # # get the scores of papers to plot the distribution 
    # score_key = "score"
    # score_values = [a_dict[score_key][0] for a_dict in sorted_list]
    # plt.hist(score_values)
    # plt.savefig('scibert_doc.png')
    return sorted_list

#TODO: change number of  publication and add argument to the function input
def get_recommended_publications(interests):

    ''' function that copmpares user model weighted keywords with paper weighted keywords'''

    user_interest_model_dict = {}  # creates a dictionary of user interest model
    
    
    limit = 30 # number of papers to retrieve
    for interest in interests: 
        user_interest_model_dict[interest['text']] = interest['weight'] 
        # e.x user_interest_model_dict = {'analytics': 5, 'peer assessment': 5, 'personalization': 5, 'theory': 5, 'recommender system': 5}
    
    # Sending Request to API
   
    response = API.search_papers_by_keyword(
        user_interest_model_dict.keys(), limit)
    papers = response['data']

    # specify embedding method
    embedding = "Transformers"
    # get user vector representation only one time because it is constant
    data_type = 'user_model'
    # get embedding vector
    # user_vector = get_weighted_vector_representation(user_interests, user_interests_weights, embedding)
    user_vector = get_vector_representation(data_type, user_interest_model_dict, embedding)
    # Extract unique papers according to their IDs and removing papers with no abstarct
    unique_papers = {each['paperId']: each for each in papers if each['abstract']}.values()
    
    # iterating over papers to extract keywords from them and calculate similarity with user interst vector
    papers_with_scores = []
    count = 0
    data_type = 'paper_keywords'

    for paper in unique_papers:
        text = (paper['title'] if paper['title'] else '') + ' ' + paper['abstract']
        algorithm = 'SingleRank'
        extract_keywords_from_paper = getKeyword(text, algorithm, 15)
        # print("\nextract keywords from papers\n", extract_keywords_from_paper)
        #{'recommender systems based': 1, 'gained significant attention': 1, 'natural language processing': 1, 'deep learning-based recommender': 3,
        # 'deep learning': 8, 'learning-based recommender systems': 3, 'recommender systems': 5, 'deep learning technology': 2, 'systems based': 1, 'deep': 8}

        # normalize weights of keywords for paper to be between 1 and 5 
        paper_keywords = normalize(extract_keywords_from_paper)
        # print("normalized weighted paper keywords", paper_keywords)

        paper_keywords = dict(sorted(paper_keywords.items(), key=lambda item: item[1],reverse=True))

        # Select top 10 keywords - keeping more 5 
        top_ten_keywords = dict(list(paper_keywords.items())[:10])
        extra_keywords = dict(list(paper_keywords.items())[10:15])
        # get vectorrepresentation for paper
        # keywords_vector = get_weighted_vector_representation(keywords_list, keywords_weights, embedding)
        # keywords_vector = get_vector_representation(data_type, paper_keywords, embedding)
        keywords_vector = get_vector_representation(data_type, top_ten_keywords, embedding)

        #convert vector shape from(1, dim) to (dim) to match user vector
        keywords_vector = np.squeeze(np.asarray(keywords_vector))
        score = (get_interest_paper_similarity_score(user_vector,keywords_vector, embedding) or 0) * 100
        
        # print('score in get recommended papers\n', score)
        #Jaleh's work 
        interest_score = 0
        interests_similarity = {}
        keywords_similarity={}
        for interest in interests: 
            interest_vector = get_vector_representation('user_model', interest, embedding)
            interest_score = np.round((get_interest_paper_similarity_score(interest_vector,keywords_vector, embedding) or 0) * 100,2)
            interests_similarity[interest['text']] = interest_score

        # Hoda
        #keyword Interest similarity-Hoda    
            for keyword, weight in top_ten_keywords.items():

                keyword_vector = get_vector_representation(data_type, keyword, embedding)

                #convert vector shape from(1, dim) to (dim) to match user vector
                keyword_vector = np.squeeze(np.asarray(keywords_vector))
                keyword_score = np.round((get_interest_paper_similarity_score(interest_vector,keyword_vector, embedding) or 0) * 100,2)

                keyword_score=keyword_score* (weight/5)
                if not keywords_similarity.__contains__(keyword):
                    keywords_similarity[keyword]={'data_weight':weight}    
                keywords_similarity[keyword][interest['text']]={'score':keyword_score,'color':''}

        if score > 40:
            paper["paper_keywords"] = top_ten_keywords
            paper["extra_keywords"] = extra_keywords
            paper['interests_similarity'] = interests_similarity
            paper['keywords_similarity'] = keywords_similarity
            paper["score"] = np.round(score,2)
            papers_with_scores.append(paper)
            count+=1
    # print('count',count)
    sorted_list = sorted(papers_with_scores,
                         key=lambda k: k['score'],
                         reverse=True)[:10]
    # # get the scores of papers to plot the distribution 
    # score_key = "score"
    # score_values = [a_dict[score_key] for a_dict in sorted_list]
    # plt.hist(score_values)
    # plt.savefig('transformers.png')
    # plt.show()
    # print(score_values)
    return sorted_list

def get_interest_paper_similarity(data):
    paper_keywords = data['paper_keywords']

    # seperating keywords and weights for paper and for user interest
    # keywords_list = list(paper_keywords.keys())
    # keywords_weights = list(paper_keywords.values())
    user_interest_model_dict = {}
    for interest in data['interests']: 
        user_interest_model_dict[interest['text']] = interest['weight']
    data_type = 'user_model'
    user_vector = get_vector_representation(data_type, user_interest_model_dict, embedding)

    # user_interests = list(user_interest_model_dict.keys())
    # user_interests_weights = list(user_interest_model_dict.values())
    data_type = 'paper_keywords'
    keywords_vector = get_vector_representation(data_type, paper_keywords, embedding)

        #convert vector shape from(1, dim) to (dim) to match user vector
    keywords_vector = np.squeeze(np.asarray(keywords_vector))

    score = np.round((get_interest_paper_similarity_score(user_vector,keywords_vector, embedding) or 0) * 100,2)
    interest_score = 0
    interests_similarity = {}
    for interest in data['interests']: 
        interest_vector = get_vector_representation('user_model', interest, embedding)
        interest_score = np.round((get_interest_paper_similarity_score(interest_vector,keywords_vector, embedding) or 0) * 100,2)
        interests_similarity[interest['text']] = interest_score
    
    paper={}
    paper["score"] = score
    paper['interests_similarity'] = interests_similarity
    return paper



def get_keywords_similarities(data):
    keywords = data['keywords']
    interests = data['interests']
    user_interest_model_dict={}
    for interest in interests: 
        user_interest_model_dict[interest['text']] = interest['weight'] 

    data_type = 'user_model'
    user_vector = get_vector_representation(data_type, user_interest_model_dict, embedding)

    # user_interests = list(user_interest_model_dict.keys())
    # user_interests_weights = list(user_interest_model_dict.values())
    data_type = 'paper_keywords'
    keywords_vector = get_vector_representation(data_type, keywords, embedding)

        #convert vector shape from(1, dim) to (dim) to match user vector
    keywords_vector = np.squeeze(np.asarray(keywords_vector))

    score = np.round((get_interest_paper_similarity_score(user_vector,keywords_vector, embedding) or 0) * 100,2)

    user_interests = list(user_interest_model_dict.keys())
    user_interests_weights = list(user_interest_model_dict.values())
    keywords_list = list(keywords.keys())
    keywords_weights = list(keywords.values())

    
    keyword_score = 0
    keywords_similarity = {}
    for keyword in keywords: 
        keyword_vector = get_vector_representation(data_type, keyword, embedding)

        #convert vector shape from(1, dim) to (dim) to match user vector
        keyword_vector = np.squeeze(np.asarray(keywords_vector))
        keyword_score = np.round((get_interest_paper_similarity_score(user_vector,keyword_vector, embedding) or 0) * 100,2)
        keywords_similarity[keyword] = keyword_score
    
    paper={}
    paper["score"] = score
    paper['keywords_similarity'] = keywords_similarity
    return paper

