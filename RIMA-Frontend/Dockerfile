FROM node:14.15.4 as build
WORKDIR /app

COPY package*.json ./
RUN  npm ci --production 2>&1

COPY . ./
RUN mv exampe.env .env &&\
    NODE_OPTIONS=--max_old_space_size=2048 npm run build 2>&1



FROM nginxinc/nginx-unprivileged:1.19
USER root
RUN chown -R nginx:nginx /usr/share/nginx/html

USER nginx
COPY --from=build --chown=nginx /app/build/ /usr/share/nginx/html
COPY ./nginx/docker-entrypoint.d/* /docker-entrypoint.d/
EXPOSE 8080
