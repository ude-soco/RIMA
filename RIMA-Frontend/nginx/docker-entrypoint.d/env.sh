#!/usr/bin/env bash
set -euo pipefail

echo "Configuring application based on ENV ..."

# :TODO: Write $API_BASE_URL (could default to http://127.0.0.1:8000/api/)
#        to a config file that is processed by the React app during runtime
