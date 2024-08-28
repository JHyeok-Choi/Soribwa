FROM node:20.15.1-slim

RUN apt-get -y update \
    && apt-get -y install git net-tools vim curl \
    && apt-get -y update

WORKDIR /docker
COPY ../nodejs /docker/nodejs
WORKDIR /docker/nodejs
RUN npm install
RUN npm install -g nodemon

CMD nodemon -L app.js