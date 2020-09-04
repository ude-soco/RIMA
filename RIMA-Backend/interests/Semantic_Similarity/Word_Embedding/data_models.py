from gensim.models.keyedvectors import KeyedVectors

print("Loading glove model..")
glove_model = KeyedVectors.load_word2vec_format("/opt/datatest_word2vec.txt")
print("glove model loaded!")
