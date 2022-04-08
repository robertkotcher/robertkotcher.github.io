FROM node:12-alpine3.10

WORKDIR /usr/src/app

RUN npm install hexo-cli
RUN npm install node-sass
COPY . .

EXPOSE 4000
CMD [ "./node_modules/hexo-cli/bin/hexo", "server", "-p", "80" ]
