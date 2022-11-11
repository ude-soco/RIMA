import os
import numpy as np
from gensim.models.keyedvectors import KeyedVectors
from gensim.models.wrappers import FastText
from nltk.corpus import stopwords
from django.conf import settings
from pandas import array
from interests.glove_model_wrapper import GetGloveVector
from interests.Semantic_Similarity.Word_Embedding.data_models import glove_model, use_model, transformer_model
#from interests.Semantic_Similarity.Word_Embedding.data_models import glove_model

def cosine_sim(vecA, vecB):
        """Find the cosine similarity distance between two vectors."""
        csim = np.dot(vecA,
                      vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim

def glove_vectorize(doc, weights):
        """Identify the vector values for each word in the given document"""

        # this code to remove stopwords and seperate the keyphrase into words but group them together
        doc = [i.lower().split() for i in doc]
        word_list = []
        for w in doc:
            w = [word for word in w if word not in stopwords.words('english')]
            word_list.append(w)
            # word_list = [['analytics'],['peer','assessment'],['personalization'],['theory'],['recommender','system']]
        vec_list = []
        for i in range(len(word_list)):
            word_vecs = []
            for word in word_list[i]:
                try:
                    vec = glove_model[word]
                    # vec = GetGloveVector(word)
                    word_vecs.append(vec)
                except KeyError:
                    pass
            
            vector = np.mean(word_vecs, axis=0)
            weighted_vector = weights[i] * np.array(vector) #[x * weights[i] for x in vector] # multiply each element in the vector with the weight value
            vec_list.append(weighted_vector)
        # summing all vectors of keywords into one vector
        vectors = np.sum(vec_list, axis=0)
        # dividing by the sum of weights
        weighted_average_vectors = vectors / np.sum(weights)
        return weighted_average_vectors

def calculate_similarity(source_doc,
                         target_doc,
                         embedding="Glove",
                         threshold=0):
    """Calculates & returns similarity scores between given source document & all the target documents."""
    def w2v_vectorize(doc):
        """Identify the vector values for each word in the given document"""
        doc = [i.lower().split() for i in doc]
       
        word_list = []
        for w in doc:
            w = [word for word in w if word not in stopwords.words('english')]
            word_list.append(w)
        vec_list = []
        for words in word_list:
            word_vecs = []
            for word in words:
                try:
                    vec = w2v_model[word]
                    word_vecs.append(vec)
                except KeyError:
                    pass
            vector = np.mean(word_vecs, axis=0)
            vec_list.append(vector)
        vectors = np.mean(vec_list, axis=0)
        return vectors

    def glove_vectorize(doc):
        """Identify the vector values for each word in the given document"""
        doc = [i.lower().split() for i in doc]
        word_list = []
        for w in doc:
            w = [word for word in w if word not in stopwords.words('english')] # this step to seperate the keyphrase into words but group them together
            word_list.append(w)
            # word_list = [['analytics'],['peer','assessment'],['personalization'],['theory'],['recommender','system']]

        vec_list = []
        for words in word_list:
            word_vecs = []
            for word in words:
                try:
                    vec = glove_model[word]
                    # vec = GetGloveVector(word)
                    word_vecs.append(vec)
                except KeyError:
                    pass
            vector = np.mean(word_vecs, axis=0)
            vec_list.append(vector)
        vectors = np.mean(vec_list, axis=0)
        return vectors

    def fasttext_vectorize(doc):
        """Identify the vector values for each word in the given document"""
        doc = " ".join(doc)
        doc = doc.lower()
        words = [w for w in doc.split(" ")]
        word_vecs = []
        for word in words:
            try:
                vec = fasttext_model[word]
                word_vecs.append(vec)
            except KeyError:
                # Ignore, if the word doesn't exist in the vocabulary
                pass
        vector = np.mean(word_vecs, axis=0)
        return vector

    def cosine_sim(vecA, vecB):
        """Find the cosine similarity distance between two vectors."""
        csim = np.dot(vecA,
                      vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim

    if embedding == "Word2Vec":
        w2v_model = KeyedVectors.load_word2vec_format(
            'Semantic_Similarity/Word_Embedding/data/GoogleNews-vectors-negative300.bin',
            binary=True,
        )
        source_vec = w2v_vectorize(source_doc)
        target_vec = w2v_vectorize(target_doc)
        sim_score = cosine_sim(source_vec, target_vec)

        if sim_score > threshold:
            return sim_score

    elif embedding == "Glove":
        source_vec = glove_vectorize(source_doc)

        target_vec = glove_vectorize(target_doc)
        sim_score = cosine_sim(source_vec, target_vec)

        if sim_score > threshold:
            return sim_score

    elif embedding == "FastText":
        fasttext_model = FastText.load_fasttext_format(
            'Semantic_Similarity/Word_Embedding/data/cc.en.300.bin')
        source_vec = fasttext_vectorize(source_doc)
        target_vec = fasttext_vectorize(target_doc)
        sim_score = cosine_sim(source_vec, target_vec)

        if sim_score > threshold:
            return sim_score

# this function created by lamees and used by Jaleh
def calculate_weighted_vectors_similarity(source_doc,
                                          target_doc,
                                          weights_1,
                                          weights_2,
                                          embedding="all-mpnet-base-v2",
                                          threshold=0):
    """Calculates & returns similarity scores between given source document & all the target documents."""

    def glove_vectorize(doc, weights):
        """Identify the vector values for each word in the given document"""

        # this code to remove stopwords and seperate the keyphrase into words but group them together
        doc = [i.lower().split() for i in doc]
        word_list = []
        for w in doc:
            w = [word for word in w if word not in stopwords.words('english')]
            word_list.append(w)
            # word_list = [['analytics'],['peer','assessment'],['personalization'],['theory'],['recommender','system']]

        vec_list = []
        for i in range(len(word_list)):
            word_vecs = []
            for word in word_list[i]:
                try:
                    vec = glove_model[word]
                    word_vecs.append(vec)
                except KeyError:
                    pass
            
            vector = np.mean(word_vecs, axis=0)
            weighted_vector = weights[i] * np.array(vector) #[x * weights[i] for x in vector] # multiply each element in the vector with the weight value
            vec_list.append(weighted_vector)
        # summing all vectors of keywords into one vector
        vectors = np.sum(vec_list, axis=0)
        # dividing by the sum of weights
        weighted_average_vectors = vectors / np.sum(weights)
        return weighted_average_vectors
    #LK
    # all-mpnet-base-v2 model from transformer, vector size = 768
    def transformer_vectorize(doc, weights):
            """Identify the vector values for each word in the given document"""

            print('doc\n', doc)
            vec_list = []
            for word in doc:
                print('word\n', word)
                try:
                    vector = transformer_model.encode(word, normalize_embeddings=True, convert_to_tensor=False)
                    #print('vector\n', vector)
                except KeyError:
                    pass
        
                weighted_vector = weights[doc.index(word)] * np.array(vector) #[x * weights[i] for x in vector] # multiply each element in the vector with the weight value
                # print('weighted_vectors\n', weighted_vector)
                vec_list.append(weighted_vector)
            # summing all vectors of keywords into one vector
            vectors = np.sum(vec_list, axis=0)
            #print(vectors)
            # dividing by the sum of weights
            weighted_average_vectors = vectors / np.sum(weights)
            #print('weighted_average_vectors\n', weighted_average_vectors)
            return weighted_average_vectors

    # universal-sentence-encoder model from tensorflow hub , vector size = 512
    def use_vectorize(doc, weights):
        """Identify the vector values for each word in the given document"""

        print('doc\n', doc)
        vec_list = []
        for word in doc:
            print('word\n', word)
            try:
                vector = use_model([word])
                #print('vector\n', vector)
            except KeyError:
                pass
    
            weighted_vector = weights[doc.index(word)] * np.array(vector) #[x * weights[i] for x in vector] # multiply each element in the vector with the weight value
            # print('weighted_vectors\n', weighted_vector)
            vec_list.append(weighted_vector)
        # summing all vectors of keywords into one vector
        vectors = np.sum(vec_list, axis=0)
        #print(vectors)
        # dividing by the sum of weights
        weighted_average_vectors = vectors / np.sum(weights)
        #print('weighted_average_vectors\n', weighted_average_vectors)
        return weighted_average_vectors

    def cosine_sim(vecA, vecB):
        """Find the cosine similarity distance between two vectors."""
        csim = np.dot(vecA,
                      vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim


    if embedding == "Glove":
        source_vec = glove_vectorize(source_doc, weights_1)

        target_vec = glove_vectorize(target_doc,weights_2)
        sim_score = cosine_sim(source_vec, target_vec)

        if sim_score > threshold:
            return sim_score
    #LK
    elif embedding == "all-mpnet-base-v2":
        #embedder = SentenceTransformer('all-mpnet-base-v2')
        source_vec = transformer_vectorize(source_doc, weights_1)
        #print('source vector\n', source_vec)
        target_vec = transformer_vectorize(target_doc, weights_2)
        #print('target vector\n', source_vec)
        sim_score =  cosine_sim(source_vec, target_vec)
        #print('similarity score',sim_score)

    elif embedding == "USE":

        source_vec = use_vectorize(source_doc, weights_1)[0]
        print('source vector\n', source_vec)
        target_vec = use_vectorize(target_doc, weights_2)[0]
        print('target vector\n', source_vec)
        sim_score =  cosine_sim(source_vec, target_vec)
        print('similarity score',sim_score)
    if sim_score > threshold:
        return sim_score

   



def calculate_weighted_vectors_similarity_single_word(source_doc,
                                                        target_doc,
                                                        source_weight,
                                                        target_weights,
                                                        embedding="Glove",
                                                        threshold=0):
    
    
    def glove_vectorize_single_word(doc):
        """Identify the vector values for each word in the given document"""
        
        # this code to remove stopwords and seperate the keyphrase into words but group them together
        doc = [i.lower().split() for i in doc]
        word_list = []
        for w in doc:
            word_list = [word for word in w if word not in stopwords.words('english')]
            # word_list = [['analytics'],['peer','assessment'],['personalization'],['theory'],['recommender','system']]

        word_vecs = []
        # for word in word_list:
        try:
            word_vecs = glove_model[word_list]
            # word_vecs = GetGloveVector(word_list)
        except KeyError:
            pass

        vector = np.mean(word_vecs, axis=0)
        return vector
        # weighted_vector =  word_weight * np.array(vector) #[x * weights[i] for x in vector] # multiply each element in the vector with the weight value
        # # dividing by the sum of weights
        # weighted_average_vector = weighted_vector / sum_weights
        # print('weighted_average_vector',weighted_average_vector)
        # return weighted_average_vector

    if embedding == "Glove":
        source_vec = glove_vectorize_single_word(source_doc)
        target_vec = glove_vectorize(target_doc,target_weights)
        sim_score = cosine_sim(source_vec, target_vec) 
        weighted_sim = sim_score * (source_weight/5)

        if weighted_sim > threshold:
            return weighted_sim
