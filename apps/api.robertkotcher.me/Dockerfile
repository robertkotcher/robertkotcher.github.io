FROM node:12-alpine3.10

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8000
CMD [ "node", "build/index.js" ]