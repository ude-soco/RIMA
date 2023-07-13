# syntax=docker/dockerfile:1.4
FROM node:18.16.1 as build
WORKDIR /app

RUN apt-get update || : && apt-get install python3 -yq

COPY ./nodejs/package*.json ./
RUN  npm ci --production 2>&1

COPY ./nodejs ./
RUN  npm run build 2>&1



FROM nginxinc/nginx-unprivileged:1.25
USER root
WORKDIR /usr/share/nginx/html
RUN chown -R nginx:nginx .

USER 101
COPY --link --from=build --chown=101 /app/build/ ./
COPY --link ./nginx/conf.d/* /etc/nginx/conf.d/
COPY --link ./nginx/docker-entrypoint.d/* /docker-entrypoint.d/

ENV NGINX_ENTRYPOINT_QUIET_LOGS 1

EXPOSE 8080
