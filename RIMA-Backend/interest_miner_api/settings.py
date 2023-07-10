"""
Django settings for interest_miner_api project.
Generated by 'django-admin startproject' using Django 3.0.5.
For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
from os.path import exists
import json
import logging.config
from django.core.management.utils import get_random_secret_key
import yaml
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, "config", "config.yaml"), "r") as file:
    configuration = file.read()
configuration = yaml.safe_load(configuration)

if exists(os.path.join(BASE_DIR, "config", "twitter_config.yaml")):
    with open(os.path.join(BASE_DIR, "config", "twitter_config.yaml"), "r") as file:
        twitter_configuration = file.read()
    twitter_configuration = yaml.safe_load(twitter_configuration)
else:
    with open(
        os.path.join(BASE_DIR, "config", "rename_twitter_config.yaml"), "r"
    ) as file:
        twitter_configuration = file.read()
    twitter_configuration = yaml.safe_load(twitter_configuration)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() == "true"

ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_celery_beat",
    "django_celery_results",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "common",
    "accounts",
    "interests",
    "drf_yasg",
    "conferences",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    # This line needs to be commented only for conference Insights and doesn't work with docker at the moment
    #'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
}

AUTH_USER_MODEL = "accounts.User"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "interest_miner_api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "interest_miner_api.wsgi.application"

# Loggin configuration
LOGGING_CONFIG = None
LOGLEVEL = os.getenv("DJANGO_LOGLEVEL", "info").upper()
logging.config.dictConfig(
    {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "console": {
                "format": "%(asctime)s %(levelname)s [%(name)s:%(lineno)s] %(module)s %(process)d %(thread)d %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "console",
            },
        },
        "loggers": {
            "": {
                "level": LOGLEVEL,
                "handlers": [
                    "console",
                ],
            },
        },
    }
)

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
if bool(os.environ.get("POSTGRES_HOST", False)):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("POSTGRES_DB"),
            "USER": os.environ.get("POSTGRES_USER"),
            "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
            "HOST": os.environ.get("POSTGRES_HOST"),
            "PORT": os.environ.get("POSTGRES_PORT", 5432),
            "OPTIONS": json.loads(os.getenv("POSTGRES_OPTIONS", "{}")),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/
STATIC_URL = "/assets/"
STATIC_ROOT = os.path.join(BASE_DIR, "assets")

# No of days for which the tweets needs to be imported
if not twitter_configuration["twitter_fetch_days"]:
    TWITTER_FETCH_DAYS = os.environ.get("TWITTER_FETCH_DAYS")
else:
    TWITTER_FETCH_DAYS = int(twitter_configuration["twitter_fetch_days"])

if not twitter_configuration["twitter_api_key"]:
    TWITTER_CONSUMER_KEY = os.environ.get("TWITTER_CONSUMER_KEY")
else:
    TWITTER_CONSUMER_KEY = twitter_configuration["twitter_api_key"]

if not twitter_configuration["twitter_api_secret_key"]:
    TWITTER_CONSUMER_SECRET = os.environ.get("TWITTER_CONSUMER_SECRET")
else:
    TWITTER_CONSUMER_SECRET = twitter_configuration["twitter_api_secret_key"]

if not twitter_configuration["twitter_access_token"]:
    TWITTER_ACCESS_TOKEN = os.environ.get("TWITTER_ACCESS_TOKEN")
else:
    TWITTER_ACCESS_TOKEN = twitter_configuration["twitter_access_token"]

if not twitter_configuration["twitter_access_token_secret"]:
    TWITTER_ACCESS_TOKEN_SECRET = os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")
else:
    TWITTER_ACCESS_TOKEN_SECRET = twitter_configuration["twitter_access_token_secret"]


# Celery settings
REDIS_HOST = os.environ.get("REDIS_HOST", "127.0.0.1")
CELERY_BROKER_URL = "redis://{}:6379".format(REDIS_HOST)
CELERY_RESULT_BACKEND = "redis://{}:6379".format(REDIS_HOST)
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERYD_TASK_SOFT_TIME_LIMIT = 60 * 60  # 1 hour timeout

SWAGGER_SETTINGS = {
    "USE_SESSION_AUTH": False,
}

TEMP_DIR = os.environ.get("TEMP_DIR", "../tmp")
MODEL_DIR = os.environ.get("MODEL_DIR", "../model")
PRELOAD_MODELS = os.environ.get("PRELOAD_MODELS", "false").lower() == "true"

SEMANTIC_SCHOLAR = os.environ.get("SEMANTIC_SCHOLAR")

if not configuration["transformer_model_file"]:
    TRANSFORMER_MODEL_FILE_PATH = None
else:
    TRANSFORMER_MODEL_FILE_PATH = os.path.abspath(
        configuration["transformer_model_file"]
    )

if not configuration["stanfordcorenlp_file"]:
    STANFORDCORENLP = None
else:
    STANFORDCORENLP = os.path.abspath(configuration["stanfordcorenlp_file"])

if not configuration["elmo_option_file"]:
    ELMO_OPTIONS_FILE = None
else:
    ELMO_OPTIONS_FILE = os.path.abspath(configuration["elmo_option_file"])

if not configuration["elmo_weight_file"]:
    ELMO_WEIGHT_FILE = None
else:
    ELMO_WEIGHT_FILE = os.path.abspath(configuration["elmo_weight_file"])

if not configuration["enwiki_file"]:
    ENWIKI_FILE = None
else:
    ENWIKI_FILE = os.path.abspath(configuration["enwiki_file"])

if not configuration["inspec_file"]:
    INSPEC = None
else:
    INSPEC = os.path.abspath(configuration["inspec_file"])

if not configuration["semeval2017vocab_file"]:
    SEMEVALVOCAB2017 = None
else:
    SEMEVALVOCAB2017 = os.path.abspath(configuration["semeval2017vocab_file"])

if not configuration["duc2001_file"]:
    DUC2001 = None
else:
    DUC2001 = os.path.abspath(configuration["duc2001_file"])

if not configuration["sif_model_file"]:
    SIF_MODEL_FILE_PATH = None
else:
    SIF_MODEL_FILE_PATH = configuration["sif_model_file"]

if not configuration["use_model_file"]:
    USE_MODEL_FILE_PATH = None
else:
    USE_MODEL_FILE_PATH = configuration["use_model_file"]

if not configuration["bert_model_file"]:
    BERT_MODEL_FILE_PATH = None
else:
    BERT_MODEL_FILE_PATH = configuration["bert_model_file"]

if not configuration["specter_model_file"]:
    SPECTER_MODEL_FILE_PATH = None
else:
    SPECTER_MODEL_FILE_PATH = configuration["specter_model_file"]

# Sif_model is used for keyword extraction
# SIF_MODEL_FILE_PATH = os.environ.get("SIF_MODEL_FILE_PATH", "squeezebert/squeezebert-mnli")
# USE_MODEL_FILE_PATH = os.environ.get("USE_MODEL_FILE_PATH", "")
# BERT_MODEL_FILE_PATH = os.environ.get("BERT_MODEL_FILE_PATH","")
# SPECTER_MODEL_FILE_PATH = os.environ.get("SPECTER_MODEL_FILE_PATH","")

# LDA_MODEL_FILE_PATH = os.path.join(
#     MODEL_DIR,
#     os.environ.get("LDA_MODEL_FILE", "keyword_extractor/lda-1000-semeval2010.py3.pickle.gz")
# )

# if os.environ.get("GLOVE_MODEL_FILE"):
#     GLOVE_MODEL_FILE_PATH = os.path.join(
#         MODEL_DIR,
#         os.environ.get("GLOVE_MODEL_FILE")
#     )
# else:
#     GLOVE_MODEL_FILE_PATH = None

# use bellow line if use_model is not used
# USE_MODEL_FILE_PATH = os.environ.get("USE_MODEL_FILE_PATH", "")
# use bellow line for USE_model after downloading it
# USE_MODEL_FILE_PATH = os.environ.get("USE_MODEL_FILE_PATH", "USE_model")

# use line bellow if msmarco model is stored in the project
# TRANSFORMER_MODEL_FILE_PATH = os.path.abspath(configuration["transformer_model_file"])
# TRANSFORMER_MODEL_FILE_PATH = os.environ.get("TRANSFORMER_MODEL_FILE_PATH","transformers/msmarco/")
# use line bellow if msmarco model is not stored in the project
# TRANSFORMER_MODEL_FILE_PATH = os.environ.get("TRANSFORMER_MODEL_FILE_PATH","msmarco-distilbert-base-tas-b")

# use bellow line if scibert is not used
# BERT_MODEL_FILE_PATH = os.environ.get("BERT_MODEL_FILE_PATH","")
# use bellow line for scibert after downloading it
# BERT_MODEL_FILE_PATH = os.environ.get("BERT_MODEL_FILE_PATH","scibert_scivocab_uncased")

# use bellow line if specter is not used
# SPECTER_MODEL_FILE_PATH = os.environ.get("SPECTER_MODEL_FILE_PATH","")
# use bellow line for specter model
# SPECTER_MODEL_FILE_PATH = os.environ.get("SPECTER_MODEL_FILE_PATH","allenai/specter")


# SIF Rank model variables
# STANFORDCORENLP = os.environ.get("STANFORDCORENLP", "interests/Keyword_Extractor/Algorithms/embedding_based/stanford-corenlp-full-2018-02-27")

# ELMO_OPTIONS_FILE = os.environ.get("Elmo_Options_File", "./interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data/elmo_2x4096_512_2048cnn_2xhighway_options.json")

# ELMO_WEIGHT_FILE = os.environ.get("Elmo_Weight_File", "./interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data/elmo_2x4096_512_2048cnn_2xhighway_weights.hdf5")

# ENWIKI_FILE = os.environ.get("Enwiki_File", "./interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data/enwiki_vocab_min200.txt")

# INSPEC = os.environ.get("Inspec", "./interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data/inspec_vocab.txt")

# SEMEVALVOCAB2017 = os.environ.get("SemEval2017Vocab", "./interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data/semeval_vocal.txt")

# DUC2001= os.environ.get("Duc2001", "./interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data/duc2001.txt")
