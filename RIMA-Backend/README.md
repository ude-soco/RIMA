# RIMA - Backend

## Table of Contents

* [Project Info](#project-info)
* [Project structure](#project-structure)
* [Technologies](#technologies)
* [Additional applications](#Additional-applications)
* [Setup](#setup)

## Project Info

This consists of the web server made with Django for RIMA project.

## Project structure
```
│   .dockerignore
│   .env.example
│   Dockerfile
│   manage.py
│   nginx.conf
│   README.md
│   requirements.txt
│
├───accounts
│   │   admin.py
│   │   apps.py
│   │   models.py
│   │   serializers.py
│   │   tests.py
│   │   urls.py
│   │   utils.py
│   │   views.py
│   │   __init__.py
│   │
│   ├───migrations
│   │   │
│   │   └───__pycache__
│   │
│   └───__pycache__
│
├───bin
│       api
│       download
│       worker
│
├───common
│   │   admin.py
│   │   apps.py
│   │   config.py
│   │   models.py
│   │   tests.py
│   │   views.py
│   │   __init__.py
│   │
│   ├───migrations
│   │   │   0001_initial.py
│   │   │   0002_triggertask.py
│   │   │   0003_auto_20200418_2043.py
│   │   │   0004_auto_20200512_1034.py
│   │   │   0005_auto_20201103_1614.py
│   │   │   __init__.py
│   │   │
│   │   └───__pycache__
│   │
│   └───__pycache__
│
├───interests
│   │   admin.py
│   │   apps.py
│   │   models.py
│   │   picture.html
│   │   semantic_scholar.py
│   │   serializers.py
│   │   tasks.py
│   │   tests.py
│   │   TopicExtractor.py
│   │   topicutils.py
│   │   tweet_preprocessing.py
│   │   twitter_utils.py
│   │   update_interests.py
│   │   urls.py
│   │   utils.py
│   │   views.py
│   │   wikipedia_utils.py
│   │   __init__.py
│   │
│   ├───DataExtractor
│   │       SemanticScholar_DataAPI.py
│   │
│   ├───Keyword_Extractor
│   │   │   extractor.py
│   │   │   __init__.py
│   │   │
│   │   ├───Algorithms
│   │   │   │   __init__.py
│   │   │   │
│   │   │   ├───graph_based
│   │   │   │   │   multipartiterank.py
│   │   │   │   │   positionrank.py
│   │   │   │   │   singlerank.py
│   │   │   │   │   single_tpr.py
│   │   │   │   │   textrank.py
│   │   │   │   │   topicrank.py
│   │   │   │   │   __init__.py
│   │   │   │   │
│   │   │   │   └───__pycache__
│   │   │   │
│   │   │   ├───statistics_based
│   │   │   │   │   rake.py
│   │   │   │   │   tfidf.py
│   │   │   │   │   yake.py
│   │   │   │   │   __init__.py
│   │   │   │   │
│   │   │   │   ├───StopwordsList
│   │   │   │   │
│   │   │   │   └───__pycache__
│   │   │   │
│   │   │   └───__pycache__
│   │   │
│   │   ├───models
│   │   │       lda-1000-semeval2010.py3.pickle.gz
│   │   │
│   │   ├───utils
│   │   │   │   base.py
│   │   │   │   datarepresentation.py
│   │   │   │   data_structures.py
│   │   │   │   highlight.py
│   │   │   │   Levenshtein.py
│   │   │   │   readers.py
│   │   │   │   utils.py
│   │   │   │
│   │   │   └───__pycache__
│   │   │
│   │   └───__pycache__
│   │
│   ├───migrations
│   │   │
│   │   └───__pycache__
│   │
│   ├───Semantic_Similarity
│   │   ├───WikiLink_Measure
│   │   │   │   Wiki.py
│   │   │   │
│   │   │   └───__pycache__
│   │   │
│   │   └───Word_Embedding
│   │       │   data_models.py
│   │       │   IMsim.py
│   │       │
│   │       ├───data
│   │       │       .gitignore
│   │       │
│   │       └───__pycache__
│   │
│   └───__pycache__
│
└───interest_miner_api
    │   api_doc_patterns.py
    │   asgi.py
    │   celery.py
    │   settings.py
    │   urls.py
    │   wsgi.py
    │   __init__.py
    │
    └───__pycache__
```

## Technologies

Project is created with:

- [Python (v3.7.1)](https://www.python.org/downloads/release/python-371/)
- Django (v2.2.3)

## Additional applications

- [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download)


## Setup

Step 1:- Download Python from [the official website](https://www.python.org/downloads/release/python-371/)

Step 2:- Download [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors

Step 3:- Install and activate python virtual environment for Windows (for [MacOS](https://programwithus.com/learn/python/pip-virtualenv-mac) and [Ubuntu](https://linuxize.com/post/how-to-create-python-virtual-environments-on-ubuntu-18-04/))

- Move to the directory ``RIMA-Backend``
  
- Open a command prompt/terminal and type the following commands

```
$ pip install virtualenv
$ pip install virtualenv-wrapper
```

IF the following warning appears,

```
WARNING: The script virtualenv.exe is installed in 'C:\Users\<user_name>\AppData\Roaming\Python\Python37\Scripts' which is not on PATH.
Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.
```

Add the path ``'C:\Users\<user_name>\AppData\Roaming\Python\Python37\Scripts'`` to your system environment variable ``Path``, where ``<user_name>`` is your username in the operating system

- Type ``virtualenv venv`` to create the virtual environment in command prompt

- Type ``.\venv\Script\activate`` to activate the virtual environment

Step 4:- Install the packages by typing ``pip install -r requirements.txt``

Step 5:- Rename the environment variable file from ``.env.example`` to ``.env``

Step 6:- Edit the environment file to add additional environment variables

Step 7:- Make sure to open another command prompt with admin rights

- Locate the virtual environment and activate 
- Move to the directory ``RIMA-Backend`` 
- Type the following commands

```
$ python -m spacy download en

$ python -c "import nltk;nltk.download('stopwords')"
$ python -c "import nltk;nltk.download('punkt')"
$ python -c "import nltk;nltk.download('sentiwordnet')"

$ pip install eventlet
```

Step 8:- Download and install Redis for [Windows](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi) ([MacOS](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) and [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04-de))

Step 9:- Type ``python manage.py migrate`` to create the database

Step 1:- Type ``python manage.py runserver`` to run the django server

Step 11:- Open another command prompt/terminal

- Locate the virtual environment and activate
- Move to the directory ``RIMA-Backend``
- Type ``celery worker --app=interest_miner_api -l info -P eventlet`` to start the celery workers

