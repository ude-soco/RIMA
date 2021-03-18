#!/usr/bin/env bash
set -euo pipefail

: $GLOVE_MODEL_GDRIVE_ID
: $GLOVE_MODEL_FILE_PATH

if [ -f "$GLOVE_MODEL_FILE_PATH" ]; then
  echo "GloVe model present: $GLOVE_MODEL_FILE_PATH"
else
  echo "GloVe model missing; downloading now ..."
  mkdir -p -- "${GLOVE_MODEL_FILE_PATH%/*}"
  $HOME/.local/bin/gdown --id $GLOVE_MODEL_GDRIVE_ID -O $GLOVE_MODEL_FILE_PATH
fi
