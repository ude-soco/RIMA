import os
import numpy as np
from gensim.models.keyedvectors import KeyedVectors
from gensim.models.fasttext import FastText
from nltk.corpus import stopwords
from django.conf import settings
from pandas import array

from interests.Semantic_Similarity.Word_Embedding.data_models import (
    use_model,
    transformer_model,
)

def cosine_sim(vecA, vecB):
    """Find the cosine similarity distance between two vectors."""
    csim = np.dot(vecA, vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
    if np.isnan(np.sum(csim)):
        return 0
    return csim

# this function created by lamees and used by Jaleh
def calculate_weighted_vectors_similarity(
    source_doc,
    target_doc,
    weights_1,
    weights_2,
    embedding="all-mpnet-base-v2",
    threshold=0,
):
    """Calculates & returns similarity scores between given source document & all the target documents."""

    # LK
    # all-mpnet-base-v2 model from transformer, vector size = 768
    def transformer_vectorize(doc, weights):
        """Identify the vector values for each word in the given document"""

        print("doc\n", doc)
        vec_list = []
        for word in doc:
            print("word\n", word)
            try:
                vector = transformer_model.encode(
                    word, normalize_embeddings=True, convert_to_tensor=False
                )
                # print('vector\n', vector)
            except KeyError:
                pass

            weighted_vector = weights[doc.index(word)] * np.array(
                vector
            )  # [x * weights[i] for x in vector] # multiply each element in the vector with the weight value
            # print('weighted_vectors\n', weighted_vector)
            vec_list.append(weighted_vector)
        # summing all vectors of keywords into one vector
        vectors = np.sum(vec_list, axis=0)
        # print(vectors)
        # dividing by the sum of weights
        weighted_average_vectors = vectors / np.sum(weights)
        # print('weighted_average_vectors\n', weighted_average_vectors)
        return weighted_average_vectors

    # universal-sentence-encoder model from tensorflow hub , vector size = 512
    def use_vectorize(doc, weights):
        """Identify the vector values for each word in the given document"""

        print("doc\n", doc)
        vec_list = []
        for word in doc:
            print("word\n", word)
            try:
                vector = use_model([word])
                # print('vector\n', vector)
            except KeyError:
                pass

            weighted_vector = weights[doc.index(word)] * np.array(
                vector
            )  # [x * weights[i] for x in vector] # multiply each element in the vector with the weight value
            # print('weighted_vectors\n', weighted_vector)
            vec_list.append(weighted_vector)
        # summing all vectors of keywords into one vector
        vectors = np.sum(vec_list, axis=0)
        # print(vectors)
        # dividing by the sum of weights
        weighted_average_vectors = vectors / np.sum(weights)
        # print('weighted_average_vectors\n', weighted_average_vectors)
        return weighted_average_vectors

    def cosine_sim(vecA, vecB):
        """Find the cosine similarity distance between two vectors."""
        csim = np.dot(vecA, vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim

    # LK
    if embedding == "all-mpnet-base-v2":
        # embedder = SentenceTransformer('all-mpnet-base-v2')
        source_vec = transformer_vectorize(source_doc, weights_1)
        # print('source vector\n', source_vec)
        target_vec = transformer_vectorize(target_doc, weights_2)
        # print('target vector\n', source_vec)
        sim_score = cosine_sim(source_vec, target_vec)
        # print('similarity score',sim_score)

    elif embedding == "USE":
        source_vec = use_vectorize(source_doc, weights_1)[0]
        print("source vector\n", source_vec)
        target_vec = use_vectorize(target_doc, weights_2)[0]
        print("target vector\n", source_vec)
        sim_score = cosine_sim(source_vec, target_vec)
        print("similarity score", sim_score)
    if sim_score > threshold:
        return sim_score
