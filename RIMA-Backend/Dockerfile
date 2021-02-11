# This handles our server API

FROM python:3.6

RUN apt update -y && apt upgrade -y && apt install postgresql postgresql-contrib nginx -y

RUN pip install --upgrade setuptools

RUN rm -rf /var/cache/apk/*
RUN mkdir -p /tmp/nginx/client-body
RUN mkdir -p /run/nginx

COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN python -m spacy download en

COPY nginx_default.conf /etc/nginx/nginx.conf

ADD datatest_word2vec.txt /opt/
ADD interests/Keyword_Extractor/models/lda-1000-semeval2010.py3.pickle.gz /opt/

COPY . /opt/app/
WORKDIR /opt/app/

EXPOSE 80
CMD bash start.sh
