""" SIFRank sentence embeddings
Author: Yi Sun https://github.com/sunyilgdx/SIFRank
"""

from typing import List, Union
import numpy as np
import nltk
from nltk.corpus import stopwords
from ..data_representation.document import Document
from .word_embeddings.base import BaseWordEmbedder
from django.conf import settings



english_punctuations = [
    ',', '.', ':', ';', '?', '(', ')', '[', ']', '&', '!', '*', '@', '#', '$',
    '%'
]
wnl = nltk.WordNetLemmatizer()
considered_tags = {'NN', 'NNS', 'NNP', 'NNPS', 'JJ'}
stop_words = set(stopwords.words("english"))


class SIFSentenceEmbeddings():
    """
    SIFRank Sentence Embeddings
    Arguments:
        wordembedding_model:
        weightfile_pretrain:
        weightfile_finetune:
        weightparam_pretrain:
        weightparam_finetune:
        dataset:
        lamda:

    """
    def __init__(self,
                 wordembedding_model: BaseWordEmbedder,
                 weightfile_pretrain: str = "",
                 weightfile_finetune: str = "",
                 weightparam_pretrain: Union[int, float] = 2.7e-4,
                 weightparam_finetune: Union[int, float] = 2.7e-4,
                 dataset: str = "",
                 lamda: Union[int, float] = 1.0):

        
        weightfile_pretrain = settings.ENWIKI_FILE
        if not weightfile_finetune:
            
            weightfile_finetune: str = settings.ENWIKI_FILE
        if dataset:
            weightfile_finetune = settings.Inspec
        else:
            weightfile_finetune = weightfile_pretrain

        self.word2weight_pretrain = self._get_word_weight(
            weightfile_pretrain, weightparam_pretrain)
        self.word2weight_finetune = self._get_word_weight(
            weightfile_finetune, weightparam_finetune)

        self.wordembedding_model = wordembedding_model
        self.lamda = lamda
        self.dataset = dataset
        self.embeddings_type = str(type(wordembedding_model)).lower()

    def get_tokenized_sent_embeddings(self,
                                      document: Document,
                                      use_doc_segmentation: bool = True,
                                      use_embedding_alignment: bool = True):
        """
        """
        if use_doc_segmentation == True and use_embedding_alignment == False:
            segmented_tokens = self._segment_sentences(document.tokens)
            embeddings = self.wordembedding_model.get_tokenized_words_embeddings(
                segmented_tokens)
            embeddings = self._splice_embeddings(embeddings, segmented_tokens)

        elif use_doc_segmentation == True and use_embedding_alignment == True:
            segmented_tokens = self._segment_sentences(document.tokens)
            embeddings = self.wordembedding_model.get_tokenized_words_embeddings(
                segmented_tokens)
            embeddings = self._align_context_embeddings(
                embeddings, segmented_tokens)
            embeddings = self._splice_embeddings(embeddings, segmented_tokens)
        else:
            embeddings = self.wordembedding_model.get_tokenized_words_embeddings(
                [document.tokens])

        candidates_embeddings = []
        weights = self._get_weights(self.word2weight_pretrain,
                                    self.word2weight_finetune,
                                    document.tokens,
                                    lamda=self.lamda,
                                    dataset=self.dataset)

        sentences_embeddings = self._get_weighted_average(
            document.tokens, document.tagged_tokens, weights, embeddings[0],
            self.embeddings_type)

        for kp in document.keyphrases_candidates:
            start = kp[1][0]
            end = kp[1][1]
            kp_embedding = self._get_candidate_weighted_average(
                document.tokens, weights, embeddings[0], start, end,
                self.embeddings_type)
            candidates_embeddings.append(kp_embedding)

        return sentences_embeddings, candidates_embeddings

    def _segment_sentences(self, tokens: List[str]) -> List[List[str]]:
        """
        Split document tokens into batches of tokens
        Arguments:
            tokens: the list of tokens
        Returns:
            2d list of segmented tokens
        """
        min_seq_len = 16

        segmented_sentences = []
        if len(tokens) <= min_seq_len:
            segmented_sentences.append(tokens)
        else:
            position = 0
            for i, token in enumerate(tokens):
                if token in ('.', '?', '!'):
                    if i - position >= min_seq_len:
                        segmented_sentences.append(tokens[position:i + 1])
                        position = i + 1
            if len(tokens[position:]) > 0:
                segmented_sentences.append(tokens[position:])

        return segmented_sentences

    def _align_context_embeddings(self, embeddings, segmented_tokens):
        """
        """
        token_embedding_map = {}
        n = 0
        for i in range(0, len(segmented_tokens)):
            for j, token in enumerate(segmented_tokens[i]):
                embedding = embeddings[i, 0, j, :]
                if token not in token_embedding_map:
                    token_embedding_map[token] = [embedding]
                else:
                    token_embedding_map[token].append(embedding)
                n += 1

        anchor_embedding_map = {}
        for token, embedding_list in token_embedding_map.items():
            average_embedding = embedding_list[0]
            for j in range(1, len(embedding_list)):
                average_embedding += embedding_list[j]
            average_embedding /= float(len(embedding_list))
            anchor_embedding_map[token] = average_embedding

        for i in range(0, embeddings.shape[0]):
            for j, token in enumerate(segmented_tokens[i]):
                embedding = anchor_embedding_map[token]
                embeddings[i, 0, j, :] = embedding

        return embeddings

    def _splice_embeddings(self, embeddings, segmented_tokens):
        """
         
        """
        _embeddings = embeddings[0:1, :, 0:len(segmented_tokens[0]), :]
        for i in range(1, len(segmented_tokens)):
            embedding = embeddings[i:i + 1, :, 0:len(segmented_tokens[i]), :]
            _embeddings = np.concatenate((_embeddings, embedding), axis=2)
        return _embeddings

    def _get_weights(self,
                     word2weight_pretrain,
                     word2weight_finetune,
                     sentences_tokens,
                     lamda,
                     dataset=""):
        """
        """
        weights = []
        for word in sentences_tokens:
            word = word.lower()

            if dataset == "":
                weight_pretrain = self._get_oov_weight(sentences_tokens,
                                                       word2weight_pretrain,
                                                       word,
                                                       method="max_weight")
                weight = weight_pretrain
            else:
                weight_pretrain = self._get_oov_weight(sentences_tokens,
                                                       word2weight_pretrain,
                                                       word,
                                                       method="max_weight")

                weight_finetune = self._get_oov_weight(sentences_tokens,
                                                       word2weight_finetune,
                                                       word,
                                                       method="max_weight")
                weight = lamda * weight_pretrain + (1.0 -
                                                    lamda) * weight_finetune
            weights.append(weight)

        return weights

    def _get_oov_weight(self,
                        sentences_tokens,
                        word2weight,
                        word,
                        method="max_weight"):
        """
        Ignore Out-Of-Vocabulary (OOV) words (set weights to 0.0)
        Arguments:
            sentences_tokens:
            word2weight:
            word:
            method:
        Returns:

        """
        word = wnl.lemmatize(word)
        if word in word2weight:
            return word2weight[word]

        if word in stop_words:
            return 0.0
        if word in english_punctuations:
            return 0.0
        if len(word) <= 2:
            return 0.0
        if method == 'max_weight':
            max = 0.0
            for w in sentences_tokens:
                if w in word2weight and word2weight[w] > max:
                    max = word2weight[w]
            return max
        return 0.0

    def _get_weighted_average(self, sentences_tokens, sentences_tagged_tokens,
                              weights, embeddings, embeddings_type):
        """
        Compute the weighted average vectors for sentences
        Arguments:
            sentences_tokens:
            sentences_tagged_tokens:
            weights:
            embeddings:
            embeddings_type:
        Returns:

        """
        n_samples = len(sentences_tokens)

        if "elmo" in embeddings_type:
            n_layers = embeddings.shape[0]
            embedding = np.zeros((n_layers, embeddings.shape[2]))
            for i in range(0, n_layers):
                for j in range(0, n_samples):
                    if sentences_tagged_tokens[j][1] in considered_tags:
                        emb = embeddings[i][j]
                        embedding[i] += emb * weights[j]
                embedding[i] = embedding[i] / float(n_samples)

            return embedding
        elif "transformers" in embeddings_type:
            embedding = np.zeros((1, embeddings.shape[2]))
            for i in range(0, 1):
                for j in range(0, n_samples):
                    if sentences_tagged_tokens[j][1] in considered_tags:
                        emb = embeddings[i][j]
                        embedding[i] += emb * weights[j]

                embedding[i] = embedding[i] / float(n_samples)

            return embedding

        return 0

    def _get_candidate_weighted_average(self, sentences_tokens, weights,
                                        embeddings, start, end,
                                        embeddings_type):
        """
        Compute the weighted average vectors for the keyphrases
        Arguments:
            sentences_tokens:
            weights:
            embeddings:
            start:
            end:
            embeddings_type:
        Returns:

        """
        assert len(sentences_tokens) == len(weights)
        n_samples = end - start
        if "elmo" in embeddings_type:
            n_layers = embeddings.shape[0]
            embedding = np.zeros((n_layers, embeddings.shape[2]))
            for i in range(0, n_layers):
                for j in range(start, end):
                    emb = embeddings[i][j]
                    embedding[i] += emb * weights[j]
                embedding[i] = embedding[i] / float(n_samples)

            return embedding
        else:
            embedding = np.zeros((1, embeddings.shape[2]))
            for i in range(0, 1):
                for j in range(start, end):
                    emb = embeddings[i][j]
                    embedding[i] += emb * weights[j]
                embedding[i] = embedding[i] / float(n_samples)

            return embedding

        return 0

    def _get_word_weight(self, weight_file, weight_param):
        """
        
        """
        if weight_param <= 0:
            weight_param = 1.0

        word2weight = {}
        with open(weight_file) as f:
            words_freqs = f.readlines()
        N = 0
        for word_freq in words_freqs:
            word_freq = word_freq.split()
            if len(word_freq) == 2:
                word2weight[word_freq[0]] = float(word_freq[1])
                N += float(word_freq[1])
        for key, value in word2weight.items():
            word2weight[key] = weight_param / (weight_param + value / N)

        return word2weight
