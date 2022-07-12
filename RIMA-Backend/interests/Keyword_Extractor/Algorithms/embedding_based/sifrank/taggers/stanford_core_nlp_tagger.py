from typing import List, Tuple, Union
from .base import BasePOSTagger
from stanfordcorenlp import StanfordCoreNLP
import logging

from ...log import LOG

logger = LOG(name=__name__, level=logging.DEBUG)


class StanfordCoreNLPTagger(BasePOSTagger):
    """
    StanforCoreNLP tagger
    https://stanfordnlp.github.io/CoreNLP/history.html
    Download the 3.9.1 version
    Arguments:
        tagger_model: the POS tagger 
    """
    def __init__(self, tagger_model: StanfordCoreNLP):
        super().__init__(tagger_model=tagger_model)
        if isinstance(tagger_model, StanfordCoreNLP):
            self.tagger_model = tagger_model
        else:
            raise ValueError("Please select a valid StanfordCoreNLP tagger")

    def get_tokenized_words(self, text: str) -> List[str]:
        """
        """
        tokens = []
        tagged_tokens = []
        try:
            tokens = self.tagger_model.word_tokenize(text)
            tagged_tokens = self.tagger_model.pos_tag(text)
            return tokens, tagged_tokens
        except Exception as e:
            logger.error(f"Failed to tokenize and tag text `{text}`", e)
            return tokens, tagged_tokens

    def get_sentences(self, text: str) -> List[str]:
        """
        """
        sentences = []
        try:
            d = self.tagger_model._request('ssplit', text[:100000])
            for s in d['sentences']:
                sent = ""
                for i, token in enumerate(s['tokens']):
                    sent += token['before'] + token['originalText']
                sentences.append(sent)

            return sentences
        except Exception as e:
            logger.error(f"Failed to get sentences ", e)
            return sentences

    def close(self):
        """
        """
        self.tagger_model.close()