# syntax=docker/dockerfile:1.4
FROM python:3.6.15-slim

RUN adduser --disabled-login -u 101 app
USER 101
WORKDIR /home/app

ENV  PATH "$PATH:/home/app/.local/bin"
RUN  pip install --no-color --quiet --no-cache-dir --user gdown

COPY --link --chown=app:app . ./

EXPOSE 8080
CMD ["bin/download"]
