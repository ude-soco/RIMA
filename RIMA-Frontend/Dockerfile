FROM node:14.15.4 as build
WORKDIR /app

COPY ./nodejs/package*.json ./
RUN  npm ci --production 2>&1

COPY ./nodejs ./
RUN SKIP_PREFLIGHT_CHECK=true \
    NODE_OPTIONS=--max_old_space_size=2048 \
    npm run build 2>&1



FROM nginxinc/nginx-unprivileged:1.19
USER root
RUN chown -R nginx:nginx /usr/share/nginx/html

USER nginx
COPY --from=build --chown=101 /app/build/ ./
COPY ./nginx/docker-entrypoint.d/* /docker-entrypoint.d/
EXPOSE 8080
