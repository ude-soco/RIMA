FROM node:8.3 as build
WORKDIR /app

COPY package*.json .
RUN  npm install --production 2>&1

ADD . ./
RUN mv exampe.env .env &&\
    npm run build 2>&1


FROM nginx:1.19
COPY --from=build /app/build/ /usr/share/nginx/html
