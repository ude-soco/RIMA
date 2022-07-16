from array import array
from gensim.models.keyedvectors import KeyedVectors
from django.conf import settings
import json
from os.path import exists
import numpy
cacheFile="glovecache.json"
dictionary_data = {}
# Because Glovemodel used Numpy array and We should save the array in the Json file, 
# we need dicionary cash for original Python array and Numpy array
dictionary_nparray = {}

def SaveCache():
    """Saving the cash-data in a Jsonfile that named glovecache.json"""
    global dictionary_data
    global cacheFile    
    a_file = open(cacheFile, "w")
    json.dump(dictionary_data, a_file)
    a_file.close()
# Create cash file, if it's not exist 
if not exists(cacheFile):
    SaveCache()
# init cash dictionary from the file    
a_file = open(cacheFile, "r")
dictionary_data=json.load( a_file)
a_file.close()
wasInit=False

glove_model = None

def EnsureGloveInit():
    """Make sure Glovemodel is load"""
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
    """Return the keyword's vector"""
    global glove_model
    global dictionary_data
    global dictionary_nparray
    # If the Keyword is a list, we call this function again per list's item
    if isinstance(keyword,list):
        return [GetVector(x) for x in keyword]
    # If keyword exist in Numpy array cash, returned it directly 
    if dictionary_nparray.__contains__(keyword):
        return dictionary_nparray[keyword]
    # Otherweise, check it in the cash which was loaded from the file
    # and convert it to Numpy array and add it to the Numpy cash and return it  
    if dictionary_data.__contains__(keyword):
        data= numpy.asarray(dictionary_data[keyword])
        dictionary_nparray[keyword]=data
        return data

    # If the keyword didn't exist in the cash, look for a keyword from the Glovemodel and 
    # add it to the cash
    EnsureGloveInit()

    if glove_model==None:
        return []
        
    try:
        vector= glove_model[keyword]
    except KeyError:
        dictionary_data[keyword]=[]
        raise KeyError()

    dictionary_data[keyword]=vector.tolist()
    dictionary_nparray[keyword]=vector
    # Saving new finded keyword's vector in the cash file
    SaveCache()

    return vector
