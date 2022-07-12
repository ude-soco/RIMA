from typing import List
from flair.data import Sentence
from flair.models import SequenceTagger
from segtok.segmenter import split_single

from .base import BasePOSTagger


class FlairTagger(BasePOSTagger):
    def __init__(self, tagger_model: str = 'flair/pos-english'):
        super().__init__(tagger_model)
        self.tagger_model = SequenceTagger.load(tagger_model)

    def get_tokenized_words(self, text: str) -> List[str]:
        """
        """
        tokens = []
        tagged_tokens = []
        sentence = Sentence(text)
        self.tagger_model.predict(sentence)

        for entity in sentence.get_spans('pos'):
            tokens.append(entity.text)
            tagged_tokens.append((entity.text, entity.get_labels()[0].value))

        assert len(tokens) == len(tagged_tokens)

        return tokens, tagged_tokens

    def get_sentences(self, text: str) -> List[str]:
        """
        """
        sentences = [sent for sent in split_single(text)]
        return sentences

    def close(self):
        """
        """
        pass