# syntax=docker/dockerfile:1.5
FROM python:3.11-slim

ENV APT_PACKAGES "make wget libarchive-tools"
RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    apt-get update -q && \
    apt-get install -qq --no-install-recommends $APT_PACKAGES

RUN adduser --disabled-login --gecos "" -u 101 app
USER 101
WORKDIR /home/app

ENV  PYTHONUNBUFFERED 1
ENV  PATH "$PATH:/home/app/.local/bin"
COPY Pipfile* .
RUN  pip install --no-color --quiet --no-cache-dir --user pipenv && \
     pipenv install --system --deploy

COPY --link --chown=101 . ./

EXPOSE 8080
CMD ["bin/download"]
