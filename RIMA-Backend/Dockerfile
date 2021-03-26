FROM python:3.6.13-slim

RUN apt-get update -qq &&\
    apt-get install -qq --no-install-recommends build-essential libpq-dev default-libmysqlclient-dev nginx curl &&\
    rm -rf /var/lib/apt/lists/*

RUN ln -sf /dev/stdout /var/log/nginx/access.log &&\
    ln -sf /dev/stderr /var/log/nginx/error.log

RUN adduser --disabled-login -u 1000 app
USER 1000
WORKDIR /home/app

ENV  PYTHONUNBUFFERED 1
ENV  PATH "$PATH:/home/app/.local/bin"
COPY --chown=app:app requirements.txt requirements.txt
RUN  pip install --no-color --quiet --no-cache-dir --user -r requirements.txt
RUN  python -m spacy download en &&\
     python -c "import nltk;nltk.download('stopwords')" &&\
     python -c "import nltk;nltk.download('punkt')" &&\
     python -c "import nltk;nltk.download('sentiwordnet')"

COPY nginx.conf .
RUN  nginx -t -c $HOME/nginx.conf -g "pid $HOME/nginx.pid;"

COPY --chown=app:app . ./
RUN  python manage.py collectstatic --no-input

ENV LDA_MODEL_FILE_PATH /home/app/interests/Keyword_Extractor/models/lda-1000-semeval2010.py3.pickle.gz
ENV GUNICORN_LOG_LEVEL info

EXPOSE 8080
CMD ["bin/api"]
