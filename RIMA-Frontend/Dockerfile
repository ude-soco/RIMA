FROM node:8.9 as build
WORKDIR /app

COPY package*.json .
RUN  npm install

ADD . ./
RUN mv exampe.env .env &&\
    npm run build


FROM nginx:1.19
COPY --from=build /app/build/ /usr/share/nginx/html
