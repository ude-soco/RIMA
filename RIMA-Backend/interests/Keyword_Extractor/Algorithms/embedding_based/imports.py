# import os
# import configparser
# from django.conf import settings
# from flair.embeddings import TransformerWordEmbeddings
# # from SifRank import KeyphraseExtractor
# from .sifrank import SifRank


# config = configparser.ConfigParser()
# path = os.path.dirname(os.path.abspath(__file__))
# configPath = os.path.join(path, 'config.ini')
# print('\nconfig path  ', configPath)
# config.read(configPath)


# ELMO_OPTIONS_FILE = config['DEFAULT']['ElmoOptionsFile']
# ELMO_WEIGHT_FILE = config['DEFAULT']['ElmoWeightFile']
# STANFORDCORENLP = config['DEFAULT']['STANFORDCORENLP']

# VOCABS_CONFIG = config['VOCAB']
# EVALUATION_CONFIG = config['EVALUATION']
# ELMO_OPTIONS_FILE = config['DEFAULT']['ElmoOptionsFile']
# ELMO_WEIGHT_FILE = config['DEFAULT']['ElmoWeightFile']
# STANFORDCORENLP = config['DEFAULT']['STANFORDCORENLP']


# if settings.SIF_MODEL_FILE_PATH:
#     sif_model = TransformerWordEmbeddings(settings.SIF_MODEL_FILE_PATH)
# else:
#     print("SIF_MODEL_FILE_PATH not set; skip loading Transformer model")
#     sif_model = None

# SIF_RANK = SifRank.KeyphraseExtractor()