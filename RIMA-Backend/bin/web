#!/usr/bin/env bash
set -euo pipefail

echo "Starting Nginx ..."
nginx -c $HOME/nginx.conf -g "pid $HOME/nginx.pid;"

echo "Starting Gunicorn ..."
gunicorn --timeout 600 interest_miner_api.wsgi:application -b 0.0.0.0:8000 \
  --log-level info --access-logfile -
