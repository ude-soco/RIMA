# syntax=docker/dockerfile:1.6
FROM nginxinc/nginx-unprivileged:1.31

COPY ./entrypoint/* /docker-entrypoint.d/

ENV NGINX_ENTRYPOINT_QUIET_LOGS=1
