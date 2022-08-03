# syntax=docker/dockerfile:1.4
FROM python:3.10.5-slim

RUN adduser --disabled-login --gecos "" -u 101 app
USER 101
WORKDIR /home/app

ENV  PATH "$PATH:/home/app/.local/bin"
RUN  pip install --no-color --quiet --no-cache-dir --user gdown

COPY --link --chown=101 . ./

EXPOSE 8080
CMD ["bin/download"]
