from __future__ import absolute_import
from .Algorithms.graph_based.topicrank import TopicRank
from .Algorithms.graph_based.singlerank import SingleRank
from .Algorithms.graph_based.multipartiterank import MultipartiteRank
from .Algorithms.graph_based.positionrank import PositionRank
from .Algorithms.graph_based.single_tpr import TopicalPageRank
from .Algorithms.graph_based.textrank import TextRank

from .Algorithms.statistics_based.rake import Rake
from .Algorithms.statistics_based import yake

import string
from nltk.corpus import stopwords


def getKeyword(text, model, num=10):
    def keTopicRank(num):
        extractor = TopicRank()
        extractor.load_document(input=text, language='en')
        extractor.candidate_selection()
        extractor.candidate_weighting()
        keyphrases = extractor.get_n_best(n=num)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    def keTextRank(num):
        pos = {'NOUN', 'PROPN', 'ADJ'}
        extractor = TextRank()
        extractor.load_document(input=text, language='en')
        extractor.candidate_weighting(window=2, pos=pos, top_percent=0.33)
        keyphrases = extractor.get_n_best(n=num)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    def keSingleRank(num):
        pos = {'NOUN', 'PROPN', 'ADJ'}
        extractor = SingleRank()
        extractor.load_document(input=text, language='en')
        extractor.candidate_selection(pos=pos)
        extractor.candidate_weighting(window=10, pos=pos)
        keyphrases = extractor.get_n_best(n=num)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    def keTopicalPageRank(num):
        pos = {'NOUN', 'PROPN', 'ADJ'}
        grammar = "NP: {<ADJ>*<NOUN|PROPN>+}"
        extractor = TopicalPageRank()
        extractor.load_document(input=text, language='en')
        extractor.candidate_selection(grammar=grammar)
        extractor.candidate_weighting(window=10, pos=pos)
        keyphrases = extractor.get_n_best(n=num)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    def kePositionRank(num):
        pos = {'NOUN', 'PROPN', 'ADJ'}
        grammar = "NP: {<ADJ>*<NOUN|PROPN>+}"
        extractor = PositionRank()
        extractor.load_document(input=text, language='en')
        extractor.candidate_selection(grammar=grammar, maximum_word_number=3)
        extractor.candidate_weighting(window=10, pos=pos)
        keyphrases = extractor.get_n_best(n=num)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    def keMultipartiteRank(num):
        extractor = MultipartiteRank()
        extractor.load_document(input=text, language='en')
        pos = {'NOUN', 'PROPN', 'ADJ'}
        stoplist = list(string.punctuation)
        stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
        stoplist += stopwords.words('english')
        extractor.candidate_selection(pos=pos, stoplist=stoplist)

        extractor.candidate_weighting(alpha=1.1,
                                      threshold=0.74,
                                      method='average')

        keyphrases = extractor.get_n_best(n=num)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    def keRake(num):
        r = Rake()
        r.extract_keywords_from_text(text)
        keyphrase = r.get_ranked_phrases()[:num]

        return keyphrase

    def keYake(num):
        max_ngram_size = 3
        custom_kwextractor = yake.KeywordExtractor(
            lan="en",
            n=max_ngram_size,
            dedupLim=0.9,
            dedupFunc='seqm',
            windowsSize=1,
            top=num,
            features=None,
        )
        keyphrases = custom_kwextractor.extract_keywords(text)

        keyphrase = []
        for kp in keyphrases:
            keyphrase.append(kp[0])

        return keyphrase

    if model == "TopicRank":
        keywords = keTopicRank(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "TextRank":
        keywords = keTextRank(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "SingleRank":
        keywords = keSingleRank(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "PositionRank":
        keywords = kePositionRank(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "Yake":
        keywords = keYake(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "Rake":
        keywords = keRake(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "MultipartiteRank":
        keywords = keMultipartiteRank(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key

    elif model == "TopicalPageRank":
        keywords = keTopicalPageRank(num)
        key = {}
        for kw in keywords:
            if " ’ " in kw:
                kw = kw.replace(" ’ ", "’ ")
            if " - " in kw:
                kw = kw.replace(" - ", "-")
            key[kw] = text.lower().count(kw.lower())
        return key
