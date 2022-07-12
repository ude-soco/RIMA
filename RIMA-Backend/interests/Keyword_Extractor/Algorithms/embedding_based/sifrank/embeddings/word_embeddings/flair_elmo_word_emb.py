from .base import BaseWordEmbedder
import numpy as np
from typing import List
from flair.embeddings import ELMoEmbeddings
from django.conf import settings
# from ....imports import ELMO_OPTIONS_FILE, ELMO_WEIGHT_FILE


class FlairElmoWordEmbeddings(BaseWordEmbedder):
    def __init__(self,
                 embedding_model: ELMoEmbeddings = ELMoEmbeddings(
                     options_file=settings.ELMO_OPTIONS_FILE,
                     weight_file=settings.ELMO_WEIGHT_FILE)):
        super().__init__(embedding_model=embedding_model)
        if isinstance(embedding_model, ELMoEmbeddings):
            self.embedding_model = embedding_model
        else:
            raise ValueError("Please select a valid ELMoEmbeddings model")

    def get_tokenized_words_embeddings(
            self, tokenized_sentences: List[List[str]]) -> np.ndarray:
        embeddings, _ = self.embedding_model.ee.batch_to_embeddings(
            tokenized_sentences)
        embeddings = embeddings.detach().cpu().numpy()

        return embeddings
