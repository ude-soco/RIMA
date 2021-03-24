import os
import numpy as np
from gensim.models.keyedvectors import KeyedVectors
from gensim.models.wrappers import FastText
from nltk.corpus import stopwords
from django.conf import settings
from interests.Semantic_Similarity.Word_Embedding.data_models import glove_model


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
            w = [word for word in w if word not in stopwords.words('english')]
            word_list.append(w)
        vec_list = []
        for words in word_list:
            word_vecs = []
            for word in words:
                try:
                    vec = glove_model[word]
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
