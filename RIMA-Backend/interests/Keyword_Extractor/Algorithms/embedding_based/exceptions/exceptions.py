class PreprocessingException(Exception):
    def __init__(self, message):
        self.message = message
        super(PreprocessingException, self).__init__(message)


class KeyphraseExtractionException(Exception):
    def __init__(self, message):
        self.message = message
        super(PreprocessingException, self).__init__(message)
