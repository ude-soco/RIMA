#!/usr/bin/env bash
set -o nounset

: $GLOVE_MODEL_GDRIVE_ID
: $GLOVE_MODEL_FILE_PATH

echo "Migrating database ..." &&\
  python manage.py migrate &&\

  echo "Fetching model file ..." &&\
    $HOME/.local/bin/gdown --id $GLOVE_MODEL_GDRIVE_ID -O $GLOVE_MODEL_FILE_PATH &&\

  echo "Starting Celery job queue ..." &&\
  celery --pidfile=/opt/celeryd.pid worker --app=interest_miner_api -l info
