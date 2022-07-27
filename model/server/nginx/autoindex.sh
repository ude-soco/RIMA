#!/bin/sh
# vim:sw=4:ts=4:et

set -e

DEFAULT_CONF_FILE="etc/nginx/conf.d/default.conf"

sed -i 's,index  index.html index.htm;,autoindex on;,' $DEFAULT_CONF_FILE
