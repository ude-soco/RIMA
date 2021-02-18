FROM node:14.15.4 as build
WORKDIR /app

COPY package*.json ./
RUN  npm install --production 2>&1

ADD . ./
RUN mv exampe.env .env &&\
    NODE_OPTIONS=--max_old_space_size=4096 npm run build 2>&1


FROM nginxinc/nginx-unprivileged:1.19
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 8080
