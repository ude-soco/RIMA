import numpy as np
import nltk
from nltk.corpus import stopwords

wnl = nltk.WordNetLemmatizer()
stop_words = set(stopwords.words("english"))


def cos_sim(embedding1, embedding2):
    """
    """
    a = np.mat(embedding1)
    b = np.mat(embedding2)
    num = float(a * b.T)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if (denom == 0.0):
        return 0.0
    else:
        cos = num / denom
        sim = 0.5 + 0.5 * cos
        return sim


def cos_sim_transformer(embedding1, embedding2):
    """
    """
    a = np.mat(embedding1)
    b = np.mat(embedding2)
    num = float(a * b.T)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0.0:
        return 0.0
    else:
        cos = num / denom
        sim = 0.5 + 0.5 * cos
        return sim


def cos_sim_distance(embedding1: np.ndarray,
                     embedding2: np.ndarray,
                     embeddings_type,
                     elmo_layers_weight=[0.0, 1.0, 0.0]) -> float:
    """
    """
    sum = 0.0
    if "elmo" in embeddings_type:
        for i in range(0, 3):
            a = embedding1[i]
            b = embedding2[i]
            sum += cos_sim(a, b) * elmo_layers_weight[i]
        return sum

    elif "transformer" in embeddings_type:
        sum = cos_sim_transformer(embedding1, embedding2)
        return sum

    return sum


def get_all_distances(candidates_embeddings, document, distances):
    """
    """
    dist_all = {}
    for i, embedding in enumerate(candidates_embeddings):
        keyphrase = document.keyphrases_candidates[i][0]
        keyphrase = keyphrase.lower()
        keyphrase = wnl.lemmatize(keyphrase)
        if keyphrase in dist_all:
            dist_all[keyphrase].append(distances[i])
        else:
            dist_all[keyphrase] = []
            dist_all[keyphrase].append(distances[i])
    return dist_all


def get_final_distance(dist_all):
    """
    """
    final_distance = {}
    for keyphrase, distances in dist_all.items():
        sum_dist = 0.0
        for distance in distances:
            sum_dist += distance
        if keyphrase in stop_words:
            sum_dist = 0.0
        final_distance[keyphrase] = sum_dist / float(len(distances))

    return final_distance


def get_position_score(candidates_keyphrases, position_bias):
    position_score = {}
    for i, kp in enumerate(candidates_keyphrases):
        np = kp[0]
        p = kp[1][0]
        np = np.lower()
        np = wnl.lemmatize(np)
        if np in position_score:
            position_score[np] += 0.0
        else:
            position_score[np] = 1 / (float(i) + 1 + position_bias)
    scores = []
    for np, score in position_score.items():
        scores.append(score)
    scores = softmax(scores)

    i = 0
    for np, score in position_score.items():
        position_score[np] = scores[i]
        i += 1
    return position_score


def softmax(x):
    exp_x = np.exp(x)
    softmax_x = exp_x / np.sum(exp_x)
    return softmax_x
