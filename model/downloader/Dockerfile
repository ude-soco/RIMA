FROM python:3.6.13-slim

RUN adduser --disabled-login -u 101 app
USER 101
WORKDIR /home/app

ENV  PATH "$PATH:/home/app/.local/bin"
RUN  pip install --no-color --quiet --no-cache-dir --user gdown

COPY --chown=app:app . ./

EXPOSE 8080
CMD ["bin/download"]
