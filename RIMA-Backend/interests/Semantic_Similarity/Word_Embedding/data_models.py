from django.conf import settings
from sentence_transformers import SentenceTransformer
import tensorflow_hub as hub
from transformers import AutoTokenizer, AutoModel
from transformers import BertTokenizer, BertModel

use_model = None
transformer_model = None
specter_tokenizer = None
specter_model = None
scibert_model = None
scibert_tokenizer = None

if settings.USE_MODEL_FILE_PATH:
    use_model = hub.load(settings.USE_MODEL_FILE_PATH)

if settings.TRANSFORMER_MODEL_FILE_PATH:
    transformer_model = SentenceTransformer(settings.TRANSFORMER_MODEL_FILE_PATH)
    # transformer_model.save('./transformers/all_distilroberta') #to store the transformer model locally

if settings.SPECTER_MODEL_FILE_PATH:
    # load model and tokenizer
    specter_tokenizer = AutoTokenizer.from_pretrained(settings.SPECTER_MODEL_FILE_PATH)
    specter_model = AutoModel.from_pretrained(settings.SPECTER_MODEL_FILE_PATH)
    # to store specter model locally uncomment the bellow 2 lines
    # specter_tokenizer.save_pretrained('./specter/')
    # specter_model.save_pretrained('./specter/')

if settings.BERT_MODEL_FILE_PATH:
    do_lower_case = True
    scibert_model = BertModel.from_pretrained(settings.BERT_MODEL_FILE_PATH)
    scibert_tokenizer = BertTokenizer.from_pretrained(settings.BERT_MODEL_FILE_PATH, do_lower_case=do_lower_case, max_seq_length=512)
