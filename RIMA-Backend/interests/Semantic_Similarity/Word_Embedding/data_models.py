from gensim.models.keyedvectors import KeyedVectors

print("Loading glove model..")
# Uncomment line 6 and comment line 5, if you want to work without docker
glove_model = KeyedVectors.load_word2vec_format("/opt/datatest_word2vec.txt")
# glove_model = KeyedVectors.load_word2vec_format("datatest_word2vec.txt")
print("glove model loaded!")
