FROM python:3.6.13-slim

ENV PYTHONUNBUFFERED 1

RUN apt-get update -qq &&\
    apt-get install -qq --no-install-recommends build-essential libpq-dev default-libmysqlclient-dev nginx &&\
    rm -rf /var/lib/apt/lists/*

RUN ln -sf /dev/stdout /var/log/nginx/access.log &&\
    ln -sf /dev/stderr /var/log/nginx/error.log

RUN adduser --disabled-login -u 1000 app
USER 1000
WORKDIR /home/app

COPY nginx.conf .
RUN  nginx -t -c $HOME/nginx.conf -g "pid $HOME/nginx.pid;"

ENV  PATH "$PATH:/home/app/.local/bin"
COPY --chown=app:app requirements.txt requirements.txt
RUN  pip install --user --no-color --quiet -r requirements.txt &&\
     python -m spacy download en &&\
     python -c "import nltk;nltk.download('stopwords')" &&\
     python -c "import nltk;nltk.download('punkt')"

ADD interests/Keyword_Extractor/models/lda-1000-semeval2010.py3.pickle.gz /opt/

COPY --chown=app:app . ./
RUN  python manage.py collectstatic --no-input

EXPOSE 8080
CMD ["./bin/web.sh"]
# CMD ["./bin/worker.sh"]
