from .embeddings.word_embeddings.base import BaseWordEmbedder
from .embeddings.word_embeddings.flair_transformers_word_emb import FlairTransformerWordEmbeddings
from .embeddings.word_embeddings.flair_elmo_word_emb import FlairElmoWordEmbeddings
from .taggers.base import BasePOSTagger
from .taggers.stanford_core_nlp_tagger import StanfordCoreNLPTagger
from .taggers.flair_tagger import FlairTagger
from stanfordcorenlp import StanfordCoreNLP
# from ..imports import STANFORDCORENLP
from django.conf import settings

def get_word_embedder(embedding_model) -> BaseWordEmbedder:
    """
    Get the word embedder
    Arguments:
        embedding_model: the word embedding model
    Returns:
        
    """
    if isinstance(embedding_model, BaseWordEmbedder):
        return embedding_model
    if "TransformerWordEmbeddings" in str(type(embedding_model)):
        return FlairTransformerWordEmbeddings(embedding_model)
    if "ELMoEmbeddings" in str(type(embedding_model)):
        return FlairElmoWordEmbeddings(embedding_model)
    if isinstance(embedding_model, str) and embedding_model != "":
        return FlairTransformerWordEmbeddings(embedding_model)

    return FlairElmoWordEmbeddings()


def get_POSTagger(tagger_model) -> BasePOSTagger:
    """
    Get the POS tagger
    Arguments:
        tagger_model: the POS tagger model
    Returns:

    """
    if isinstance(tagger_model, BasePOSTagger):
        return tagger_model
    if isinstance(tagger_model, str) and tagger_model != "":
        return FlairTagger(tagger_model)
    if isinstance(tagger_model, StanfordCoreNLP):
        return StanfordCoreNLPTagger(tagger_model)
    return StanfordCoreNLPTagger(StanfordCoreNLP(settings.STANFORDCORENLP, quiet=True))
