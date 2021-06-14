from gensim.models.keyedvectors import KeyedVectors
from django.conf import settings

# avoiding Loading GloVe model
if not settings.GLOVE_MODEL_FILE_PATH:
    print("Loading GloVe model ...")
    glove_model = KeyedVectors.load_word2vec_format(settings.GLOVE_MODEL_FILE_PATH)
    print("... finished loading GloVe model")
else:
    print("GLOVE_MODEL_FILE_PATH not set; skip loading GloVe model")
    glove_model = None
