# syntax=docker/dockerfile:1.5
FROM nginxinc/nginx-unprivileged:1.22

ADD ./entrypoint/* /docker-entrypoint.d/

ENV NGINX_ENTRYPOINT_QUIET_LOGS 1
