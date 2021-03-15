#!/usr/bin/env bash
set -euo pipefail

DUMMY_BASE_URL="http://127.0.0.1:8000"
ESCAPED_DUMMY_BASE_URL=$(echo "$DUMMY_BASE_URL" | sed -e 's/\([[\/.*]\|\]\)/\\&/g')

ESCAPED_BASE_URL=$(printf '%s\n' "$BASE_URL" | sed -e 's/[\/&]/\\&/g')

echo "Rewriting $DUMMY_BASE_URL to $BASE_URL ..."
find /usr/share/nginx/html -type f -exec \
  sed -i "s#$ESCAPED_DUMMY_BASE_URL#$ESCAPED_BASE_URL#g" {} \;
