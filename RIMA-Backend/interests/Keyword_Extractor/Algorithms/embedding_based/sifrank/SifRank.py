import numpy as np
from .utils import get_word_embedder
from .utils import get_POSTagger
from .data_representation.document import Document
from .embeddings.sif_sentence_embedding import SIFSentenceEmbeddings
from typing import Union, List, Tuple
from .method import cos_sim_distance, get_all_distances, get_final_distance, get_position_score
import logging
from ..log import LOG
from ..exceptions.exceptions import KeyphraseExtractionException

logger = LOG(name=__name__, level=logging.DEBUG)


class KeyphraseExtractor:
    """
    Extractor 
    """
    def __init__(self, embedding_model="", tagger_model=None):

        self.tagger = tagger_model
        self.tagger_model = get_POSTagger(self.tagger)
        self.wordembedding_model = get_word_embedder(embedding_model)
        self.embeddings_type = str(type(self.wordembedding_model)).lower()

    # close the stanfordcorenlp connection in the destructor
    # def __del__(self):
    #     self.tagger_model.close()

    def extract_keyphrases(self,
                           text: str,
                           top_n: int = 15,
                           elmo_layers_weight=[0.0, 1.0, 0.0],
                           lamda: Union[int, float] = 1.0,
                           use_doc_segmentation: bool = True,
                           use_embedding_alignment: bool = True,
                           method: str = "sifrank",
                           dataset: str = "",
                           position_bias=3.4) -> List[Tuple[str, float]]:
        """
        Extract Keyphrases
        Arguments:
            text:
            top_n:
            elmo_layers_weight:
            lamda:
            use_doc_segmentation:
            use_embedding_alignment:
            method:
            position_bias:
        Returns:

        """
        try:
            # self.tagger_model = get_POSTagger(self.tagger)
            document = Document(tagger_model=self.tagger_model, text=text)
            if not method:
                method = "sifrank"

            if method == "sifrank":
                keyphrases = self.SIFRank(
                    document=document,
                    lamda=lamda,
                    use_doc_segmentation=use_doc_segmentation,
                    use_embedding_alignment=use_embedding_alignment,
                    top_n=top_n,
                    dataset=dataset,
                    elmo_layers_weight=elmo_layers_weight)

                # self.tagger_model.close()
                return keyphrases
            elif method == "sifrankplus":
                keyphrases = self.SIFRankPlus(
                    document=document,
                    lamda=lamda,
                    use_doc_segmentation=use_doc_segmentation,
                    use_embedding_alignment=use_embedding_alignment,
                    top_n=top_n,
                    position_bias=position_bias,
                    elmo_layers_weight=elmo_layers_weight)
                self.tagger_model.tagger_model.close()
                return keyphrases
        except Exception as e:
            logger.error("Failed to extract keyphrases", e)
            self.tagger_model.tagger_model.close()
            raise KeyphraseExtractionException(
                "Failed to extract keyphrases - %s" % e)

    def SIFRank(self, document, lamda, use_doc_segmentation,
                use_embedding_alignment, top_n, dataset, elmo_layers_weight):
        """
        """
        self.sif_sent_embedding = SIFSentenceEmbeddings(
            wordembedding_model=self.wordembedding_model, lamda=lamda, dataset=dataset)

        sentences_embeddings, candidates_embeddings = self.sif_sent_embedding.get_tokenized_sent_embeddings(
            document, use_doc_segmentation, use_embedding_alignment)

        distances = []
        for i, embedding in enumerate(candidates_embeddings):
            distance = cos_sim_distance(sentences_embeddings, embedding,
                                        self.embeddings_type,
                                        elmo_layers_weight)
            distances.append(distance)

        dist_all = get_all_distances(candidates_embeddings, document,
                                     distances)
        keyphrases = get_final_distance(dist_all)
        return sorted(keyphrases.items(), key=lambda x: x[1],
                      reverse=True)[0:top_n]

    def SIFRankPlus(self, document, lamda, use_doc_segmentation,
                    use_embedding_alignment, top_n, position_bias,
                    elmo_layers_weight):
        """
        """
        self.sif_sent_embedding = SIFSentenceEmbeddings(
            wordembedding_model=self.wordembedding_model, lamda=lamda)

        sentences_embeddings, candidates_embeddings = self.sif_sent_embedding.get_tokenized_sent_embeddings(
            document, use_doc_segmentation, use_embedding_alignment)
        position_score = get_position_score(document.keyphrases_candidates,
                                            position_bias)

        average_score = sum(position_score.values()) / (float)(
            len(position_score))
        distances = []
        for i, embedding in enumerate(candidates_embeddings):
            distance = cos_sim_distance(sentences_embeddings, embedding,
                                        self.embeddings_type,
                                        elmo_layers_weight)
            distances.append(distance)

        dist_all = get_all_distances(candidates_embeddings, document,
                                     distances)
        keyphrases = get_final_distance(dist_all)
        for np, distance in keyphrases.items():
            if np in position_score:
                keyphrases[np] = distance * position_score[np] / average_score

        return sorted(keyphrases.items(), key=lambda x: x[1],
                      reverse=True)[0:top_n]