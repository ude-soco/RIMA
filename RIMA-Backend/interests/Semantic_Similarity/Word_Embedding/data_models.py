from array import array
from gensim.models.keyedvectors import KeyedVectors
from django.conf import settings
import json
from os.path import exists
import numpy
cacheFile="glovecache.json"
dictionary_data = {}
dictionary_ndarray = {}

def SaveCache():
    global dictionary_data
    global cacheFile    
    a_file = open(cacheFile, "w")
    json.dump(dictionary_data, a_file)
    a_file.close()

if not exists(cacheFile):
    SaveCache()
a_file = open(cacheFile, "r")
dictionary_data=json.load( a_file)
a_file.close()
wasInit=False

glove_model = None

def EnsureGloveInit():
    global wasInit
    global glove_model
    if wasInit:
        return glove_model
    if settings.GLOVE_MODEL_FILE_PATH:
        print("Loading GloVe model ...")
        glove_model = KeyedVectors.load_word2vec_format(settings.GLOVE_MODEL_FILE_PATH)
        print("... finished loading GloVe model")
    else:
        print("GLOVE_MODEL_FILE_PATH not set; skip loading GloVe model")
    wasInit = True
    return glove_model

def GetVector(keyword):
    global glove_model
    global dictionary_data
    global dictionary_ndarray
    if isinstance(keyword,list):
        return [GetVector(x) for x in keyword]
    if dictionary_ndarray.__contains__(keyword):
        return dictionary_ndarray[keyword]
    if dictionary_data.__contains__(keyword):
        data= numpy.asarray(dictionary_data[keyword])
        dictionary_ndarray[keyword]=data
        return data
    
    EnsureGloveInit()
    if glove_model==None:
        return []
    try:
        vector= glove_model[keyword]
    except KeyError:
        dictionary_data[keyword]=[]
        raise KeyError()

    dictionary_data[keyword]=vector.tolist()
    dictionary_ndarray[keyword]=vector

    SaveCache()

    return vector
