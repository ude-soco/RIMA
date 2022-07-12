import numpy as np
from typing import List


class BaseWordEmbedder:
    """
    Base Embedder for creating embedding models
    Arguments:
        embedding_model: the embedding model used to extract word embeddings from the document tokenized sentences
    """
    def __init__(self, embedding_model=None):
        self.embedding_model = embedding_model

    def get_tokenized_words_embeddings(
            self, tokenized_sentences: List[List[str]]) -> np.ndarray:
        """
        Embed the tokenized sentences into an n-dimensional matrix of embeddings
        Arguments:
            tokenized_sentences: 2D list of tokenized sentences
        Returns:
            ndarray words embeddings with shape (len(sentences), 1, dimension of embeddings)
        """
        pass
