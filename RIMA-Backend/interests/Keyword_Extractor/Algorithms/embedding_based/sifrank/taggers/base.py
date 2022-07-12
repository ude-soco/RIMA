from typing import List, Tuple


class BasePOSTagger:
    """
    Base POS tagger for tokenizing sentences 
    Arguments:
        tagger_model: the pos tagger model
    """
    def __init__(self, tagger_model=None):
        self.tagger_model = tagger_model

    def get_tokenized_words(self, text: str) -> List[str]:
        """
        Tokenize text
        Arguments:
            text: text to be tokenized
        Returns:
            List of tokens
        """
        pass

    def get_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences
        Arguments:
            text: text to split
        Returns:
            List of sentences
        """
        pass