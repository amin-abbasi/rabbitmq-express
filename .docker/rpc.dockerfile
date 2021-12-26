FROM node:12-alpine3.12 AS builder

# WORKDIR /usr/src

RUN npm i -g nodemon typescript ts-node

COPY package.json ./package.json
RUN npm install

COPY . .

# CMD [ "nodemon ../src/rpc/server" ]
CMD nodemon ./src/rpc/server
