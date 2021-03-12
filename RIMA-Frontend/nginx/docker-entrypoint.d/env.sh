#!/usr/bin/env bash
set -euo pipefail

echo "Configuring application based on ENV ..."

ESCAPED_DUMMY_API_BASE_URL=$(echo "http://127.0.0.1:8000/api" | sed -e 's/\([[\/.*]\|\]\)/\\&/g')
ESCAPED_REAL_API_BASE_URL=$(printf '%s\n' "$API_BASE_URL" | sed -e 's/[\/&]/\\&/g')

find /usr/share/nginx/html -type f -print0 | \
  xargs -0 sed -i  "s/$ESCAPED_DUMMY_API_BASE_URL/$ESCAPED_REAL_API_BASE_URL/g"

# :TODO: Write $API_BASE_URL to a config file that is processed by the React app during runtime
