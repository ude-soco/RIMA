from gensim.models.keyedvectors import KeyedVectors
from django.conf import settings
from sentence_transformers import SentenceTransformer, models
import tensorflow as tf
import tensorflow_hub as hub
from transformers import AutoTokenizer, AutoModel
import torch
from transformers import BertTokenizer, BertModel

if settings.GLOVE_MODEL_FILE_PATH:
    print("Loading GloVe model ...")
    glove_model = KeyedVectors.load_word2vec_format(settings.GLOVE_MODEL_FILE_PATH)
    print("... finished loading GloVe model")
else:
    print("GLOVE_MODEL_FILE_PATH not set; skip loading GloVe model")
    glove_model = None

if settings.USE_MODEL_FILE_PATH:
    use_model = hub.load(settings.USE_MODEL_FILE_PATH)

else:
    print("USE_MODEL_FILE_PATH not set; skip loading USE model")
    use_model = None

if settings.TRANSFORMER_MODEL_FILE_PATH:

    transformer_model = SentenceTransformer(settings.TRANSFORMER_MODEL_FILE_PATH)

    # transformer_model.save('./transformers/all_distilroberta') #to store the transformer model locally
else:
    print("TRANSFORMER_MODEL_FILE_PATH not set; skip loading Transformer model")
    transformer_model = None

if settings.SPECTOR_MODEL_FILE_PATH:
    # load model and tokenizer
    spector_tokenizer = AutoTokenizer.from_pretrained(settings.SPECTOR_MODEL_FILE_PATH)
    spector_model = AutoModel.from_pretrained(settings.SPECTOR_MODEL_FILE_PATH)
    # spector_tokenizer.save_pretrained('./spector/')
    # spector_model.save_pretrained('./spector/')

else:
    print("SPECTOR_MODEL_FILE_PATH not set; skip loading spector model")
    transformer_model = None

if settings.BERT_MODEL_FILE_PATH:
    do_lower_case = True
    scibert_model = BertModel.from_pretrained(settings.BERT_MODEL_FILE_PATH)
    scibert_tokenizer = BertTokenizer.from_pretrained(settings.BERT_MODEL_FILE_PATH, do_lower_case=do_lower_case, max_seq_length=512)

else:
    print("SciBERT_MODEL_FILE_PATH not set; skip loading scibert model")
    transformer_model = None

