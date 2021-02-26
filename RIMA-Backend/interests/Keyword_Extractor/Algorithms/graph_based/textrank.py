# -*- coding: utf-8 -*-
# Authors: Ygor Gallina, Florian Boudin
"""TextRank keyphrase extraction model.

Implementation of the TextRank model for keyword extraction described in:

* Rada Mihalcea and Paul Tarau.
  TextRank: Bringing Order into Texts
  *In Proceedings of EMNLP*, 2004.

"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import math
import logging

import networkx as nx

from interests.Keyword_Extractor.utils.base import LoadFile


class TextRank(LoadFile):
    def __init__(self):
        """Redefining initializer for TextRank."""

        super(TextRank, self).__init__()

        self.graph = nx.Graph()
        """The word graph."""

    def candidate_selection(self, pos=None):
        """Candidate selection using longest sequences of PoS.

        Args:
            pos (set): set of valid POS tags, defaults to ('NOUN', 'PROPN',
                'ADJ').
        """

        if pos is None:
            pos = {'NOUN', 'PROPN', 'ADJ'}

        # select sequence of adjectives and nouns
        self.longest_pos_sequence_selection(valid_pos=pos)

    def build_word_graph(self, window=2, pos=None):

        if pos is None:
            pos = {'NOUN', 'PROPN', 'ADJ'}

        # flatten document as a sequence of (word, pass_syntactic_filter) tuples
        text = [(word, sentence.pos[i] in pos) for sentence in self.sentences
                for i, word in enumerate(sentence.stems)]

        # add nodes to the graph
        self.graph.add_nodes_from([word for word, valid in text if valid])

        # add edges to the graph
        for i, (node1, is_in_graph1) in enumerate(text):

            # speed up things
            if not is_in_graph1:
                continue

            for j in range(i + 1, min(i + window, len(text))):
                node2, is_in_graph2 = text[j]
                if is_in_graph2 and node1 != node2:
                    self.graph.add_edge(node1, node2)

    def candidate_weighting(self,
                            window=2,
                            pos=None,
                            top_percent=None,
                            normalized=False):
        """Tailored candidate ranking method for TextRank. Keyphrase candidates
        are either composed from the T-percent highest-ranked words as in the
        original paper or extracted using the `candidate_selection()` method.
        Candidates are ranked using the sum of their (normalized?) words.

        Args:
            window (int): the window for connecting two words in the graph,
                defaults to 2.
            pos (set): the set of valid pos for words to be considered as nodes
                in the graph, defaults to ('NOUN', 'PROPN', 'ADJ').
            top_percent (float): percentage of top vertices to keep for phrase
                generation.
            normalized (False): normalize keyphrase score by their length,
                defaults to False.
        """

        if pos is None:
            pos = {'NOUN', 'PROPN', 'ADJ'}

        # build the word graph
        self.build_word_graph(window=window, pos=pos)

        # compute the word scores using the unweighted PageRank formulae
        w = nx.pagerank_scipy(self.graph, alpha=0.85, tol=0.0001, weight=None)

        # generate the phrases from the T-percent top ranked words
        if top_percent is not None:

            # warn user as this is not the pke way of doing it
            logging.warning(
                "Candidates are generated using {}-top".format(top_percent))

            # computing the number of top keywords
            nb_nodes = self.graph.number_of_nodes()
            to_keep = min(math.floor(nb_nodes * top_percent), nb_nodes)

            # sorting the nodes by decreasing scores
            top_words = sorted(w, key=w.get, reverse=True)

            # creating keyphrases from the T-top words
            self.longest_keyword_sequence_selection(top_words[:int(to_keep)])

        # weight candidates using the sum of their word scores
        for k in self.candidates.keys():
            tokens = self.candidates[k].lexical_form
            self.weights[k] = sum([w[t] for t in tokens])
            if normalized:
                self.weights[k] /= len(tokens)

            # use position to break ties
            self.weights[k] += self.candidates[k].offsets[0] * 1e-8
