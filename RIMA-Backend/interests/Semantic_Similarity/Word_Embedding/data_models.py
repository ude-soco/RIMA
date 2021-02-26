from gensim.models.keyedvectors import KeyedVectors

print("Loading glove model..")
glove_model = KeyedVectors.load_word2vec_format(GLOVE_MODEL_FILE_PATH)
print("glove model loaded!")
