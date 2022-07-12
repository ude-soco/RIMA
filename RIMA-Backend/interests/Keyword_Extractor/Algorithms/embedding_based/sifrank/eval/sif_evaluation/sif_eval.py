from kep import YAKE
from kep import TopicalPageRank
from kep import TopicRank
from kep import TextRank
from kep import TFIDF
from kep import SingleRank
from kep import Rake
from kep import PositionRank
from kep import MultiPartiteRank
from kep import KPMiner
from kep import KEA
from kwpextractor_eval import KWPExtractor

import json
import time
from tqdm import tqdm

import nltk
import pandas as pd

import read_datasets
from imports import EVALUATION_CONFIG


def calculate_scores(num_c, num_e, num_s):
    P = float(num_c) / float(num_e)
    R = float(num_c) / float(num_s)
    if P + R == 0.0:
        F1 = 0
    else:
        F1 = (2 * P * R) / (P + R)
    return P, R, F1


def scores_to_dict(P, R, F1, N):
    return {f"P.{N}": P, f"R.{N}": R, f"F1.{N}": F1}


def _scores_to_dict(tokens_length, P, R, F1, N):
    return {f"#Tokens": tokens_length, f"P.{N}": P, f"R.{N}": R, f"F1.{N}": F1}


def generate_scores_table(model_names, model_scores):
    table = pd.DataFrame(model_scores, index=model_names)
    table.index.name = "Models"
    return table


def save_scores(scores, path, format='csv'):
    with open(path, 'w') as file:
        if format == 'csv':
            for dataset_name, scores_table in scores.items():
                file.write(f"Evaluation results on \*\*{dataset_name}\*\*" +
                           "\n")
                file.write(scores_table.to_csv() + "\n")
        elif format == 'markdown':
            for dataset_name, scores_table in scores.items():
                file.write(f"Evaluation results on \*\*{dataset_name}\*\*" +
                           "\n")
                file.write(scores_table.to_markdown() + "\n")
        elif format == 'json':
            scores_dict = {
                dataset_name: scores.to_dict(orient='index')
                for dataset_name, scores in scores.items()
            }
            json.dump(scores_dict, file)


def evaluate(model, dataset_name):
    time_start = time.time()

    P = R = F1 = 0.0
    num_c_5 = num_c_10 = num_c_15 = 0
    num_e_5 = num_e_10 = num_e_15 = 0
    num_s = 0

    porter = nltk.PorterStemmer()

    try:

        if dataset_name == "Inspec":
            data, labels = read_datasets.get_inspec_data()
        elif dataset_name == "DUC2001":
            data, labels = read_datasets.get()
        else:
            data, labels = read_datasets.get_data(dataset_name)

        print(f"Successfully loaded {model.__class__.__name__} model")

        ss = []
        for key, data in tqdm(
                data.items(),
                desc=
                f"Run {model.__class__.__name__} on {dataset_name} records..."
        ):
            print("File: ", key)
            _labels = labels[key]
            _labels_stemed = []

            for label in _labels:
                tokens = label.split()
                _labels_stemed.append(' '.join(porter.stem(t) for t in tokens))

            keywords = model.runSingleDoc(data)

            j = 0
            for temp in keywords[0:numOfKeyphrases]:
                tokens = temp[0].split()
                tt = ' '.join(porter.stem(t) for t in tokens)
                if tt in _labels_stemed or temp[0] in labels[key]:
                    if j < 5:
                        num_c_5 += 1
                        num_c_10 += 1
                        num_c_15 += 1

                    elif j < 10 and j >= 5:
                        num_c_10 += 1
                        num_c_15 += 1

                    elif j < 15 and j >= 10:
                        num_c_15 += 1
                j += 1

            if len(keywords[0:5]) == 5:
                num_e_5 += 5

            else:
                num_e_5 += len(keywords[0:5])

            if len(keywords[0:10]) == 10:
                num_e_10 += 10

            else:
                num_e_10 += len(keywords[0:10])

            if len(keywords[0:15]) == 15:
                num_e_15 += 15

            else:
                num_e_15 += len(keywords[0:15])

            num_s += len(labels[key])

        p, r, f = calculate_scores(num_c_5, num_e_5, num_s)
        scores_5 = scores_to_dict(p, r, f, 5)
        p, r, f = calculate_scores(num_c_10, num_e_10, num_s)
        scores_10 = scores_to_dict(p, r, f, 10)
        p, r, f = calculate_scores(num_c_15, num_e_15, num_s)
        scores_15 = scores_to_dict(p, r, f, 15)

        scores = {
            **scores_5,
            **scores_10,
            **scores_15, "time": time.time() - time_start
        }

        return scores
    except ValueError as e:
        print("Error:", e)


if __name__ == '__main__':

    models = {
        # "YAKE": YAKE,
        # "Rake": Rake,
        # "MultiPartiteRank": MultiPartiteRank,
        # "TopicalPageRank": TopicalPageRank,
        # "TopicRank": TopicRank,
        # "PositionRank": PositionRank,
        # "SingleRank": SingleRank,
        # "TextRank": TextRank,
        # "KPMiner": KPMiner,
        # "TFIDF": TFIDF,
        # "KEA": KEA,
        "KWPExtractor": KWPExtractor
    }

    listOfDatasets = [
        'Inspec',
        # 'SemEval2017',
        # 'DUC2001'
    ]

    eval_results_path = 'eval_results.csv'
    output_format = "markdown"

    normalization = None
    numOfKeyphrases = 15

    dataConfig = EVALUATION_CONFIG

    datasetsPath = EVALUATION_CONFIG['datasets']
    dataPath = EVALUATION_CONFIG['Root']

    scores = {}

    for dataset_name in listOfDatasets:
        evaluated_models = []
        evaluated_model_scores = []
        evaluated_model_ind_scores = []

        for model_name, model in models.items():
            if model_name in ("TopicalPageRank", "PositionRank", "SingleRank",
                              "TextRank", "KPMiner", "TFIDF"):
                modelObj = model(numOfKeyphrases, dataPath, dataset_name,
                                 normalization)
            elif model_name == "KEA":
                modelObj = model(numOfKeyphrases, dataPath, dataset_name,
                                 normalization)
                modelObj.TrainingModel()
            elif model_name in ("SIFRank", "SIFRankPlus"):
                modelObj = model(numOfKeyphrases, dataPath, dataset_name,
                                 normalization)
            else:
                modelObj = model(numOfKeyphrases, dataPath, dataset_name)

            model_scores = evaluate(modelObj, dataset_name)
            evaluated_model_scores.append(model_scores)
            evaluated_models.append(model_name)

        scores_table = generate_scores_table(evaluated_models,
                                             evaluated_model_scores)

        scores[dataset_name] = scores_table

    save_scores(scores, eval_results_path, output_format)