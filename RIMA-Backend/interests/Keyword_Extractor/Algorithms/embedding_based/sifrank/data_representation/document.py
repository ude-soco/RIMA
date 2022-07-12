import nltk
from nltk.corpus import stopwords
from nltk import RegexpParser
from ..taggers.base import BasePOSTagger
from typing import Tuple, List

stopword_dict = set(stopwords.words('english'))


class Document:
    def __init__(self, tagger_model: BasePOSTagger, text: str = ""):
        """
        Document
        Arguments:
            tagger_model: POS tagger model
            text: text to extract keyphrases from 
        """
        self.tokens, self.tagged_tokens = tagger_model.get_tokenized_words(
            text)
        self.grammar = """  NP:
                {<NN.*|JJ>*<NN.*>}"""

        for i, token in enumerate(self.tokens):
            if token.lower() in stopword_dict:
                self.tagged_tokens[i] = (token, 'IN')
        self.keyphrases_candidates = self.extract_candidates(
            self.tagged_tokens)

    def extract_candidates(
            self,
            tagged_tokens: Tuple[str,
                                 str]) -> List[Tuple[str, Tuple[int, int]]]:
        """
        Extracts keyphrase candidates with respect to grammar
        Arguments:
            tagged_tokens: list of tagged tokens
        Returns:
            list of keyphrase candidates
        """
        chunker = RegexpParser(self.grammar)
        parsed_tokens = chunker.parse(tagged_tokens)
        keyphrase_candidates = []
        count = 0
        for token in parsed_tokens:
            if isinstance(token, nltk.tree.Tree) and token._label == 'NP':
                phrase = ' '.join(word for word, tag in token.leaves())
                length = len(token.leaves())
                phrase_start_end = (count, count + length)
                count += length
                keyphrase_candidates.append((phrase, phrase_start_end))

            else:
                count += 1
        return keyphrase_candidates