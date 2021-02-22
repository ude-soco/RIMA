#!/usr/bin/env bash
set -o nounset

echo "Migrating database ..." &&\
  python manage.py migrate &&\

  echo "Starting Celery job queue ..." &&\
  celery --pidfile=/opt/celeryd.pid worker --app=interest_miner_api -l info
