from django.conf import settings
from flair.embeddings import TransformerWordEmbeddings
from .sifrank.SifRank import KeyphraseExtractor

# if settings.SIF_MODEL_FILE_PATH:
#     sif_model = TransformerWordEmbeddings(settings.SIF_MODEL_FILE_PATH)
# else:
#     print("SIF_MODEL_FILE_PATH not set; skip loading Transformer model")
#     sif_model = None

# SIF_RANK = SifRank.KeyphraseExtractor(tagger_model='flair/pos-english')
# sifrank with sequeeze bert
SIF_RANK = KeyphraseExtractor(embedding_model=None)
# SIF_RANK = SifRank.KeyphraseExtractor(embedding_model=sif_model)
#sifrank with elmo
# SIF_RANK = SifRank.KeyphraseExtractor()