import wikipediaapi
import re
import math
import numpy as np
from collections import OrderedDict


def wikisim(source_doc, target_doc):
    def backlinkterm(term):
        res = []
        for k in term.backlinks.keys():
            res.append(k)

        return res

    def termsimilarity(x, y):
        wiki = wikipediaapi.Wikipedia('en')
        pagex = wiki.page(x)
        pagey = wiki.page(y)
        bx = backlinkterm(pagex)
        lenx = len(bx)
        by = backlinkterm(pagey)
        leny = len(by)
        common = [i for i in bx if i in by]
        if len(common) == 0:
            googleMeasure = 1.0
        else:
            googleMeasure = ((math.log(max(lenx, leny))) -
                             (math.log(len(common)))) / (
                                 math.log(5944399) - math.log(min(lenx, leny)))

        if googleMeasure >= 1:
            return 0
        else:
            return 1 - googleMeasure

    def Wikivectoriz(source_doc=[], target_doc=[]):
        A = list(set(source_doc + target_doc))
        # print(A)
        vec_s = OrderedDict()
        vecs0 = []
        vecs1 = []
        vec_t = OrderedDict()
        vect0 = []
        vect1 = []

        for a in A:
            if a in source_doc:
                vec_s[a] = 1
                vecs1.append(a)
            elif a not in source_doc:
                vec_s[a] = 0
                vecs0.append(a)
            if a in target_doc:
                vec_t[a] = 1
                vect1.append(a)
            elif a not in target_doc:
                vec_t[a] = 0
                vect0.append(a)

        # print(vec_s,vec_t)
        for s0 in vecs0:
            simlists = []
            for s in vecs1:
                simlists.append(termsimilarity(s0, s))
            sims = np.mean(simlists)
            vec_s[s0] = sims

        for t0 in vect0:
            simlistt = []
            for t in vect1:
                simlistt.append(termsimilarity(t0, t))
            simt = np.mean(simlistt)
            vec_t[t0] = simt
        # print(vec_s,vec_t)
        vecs = list(vec_s.values())
        vect = list(vec_t.values())

        return vec_s, vec_t, vecs, vect

    def cosine_sim(vecA, vecB):
        """Find the cosine similarity distance between two vectors."""
        csim = np.dot(vecA,
                      vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim

    vecpair = Wikivectoriz(source_doc, target_doc)
    similarity = cosine_sim(vecpair[2], vecpair[3])

    return similarity
