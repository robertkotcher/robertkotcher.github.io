FROM node:16.3.0-alpine AS builder
WORKDIR /var/app

COPY . .
RUN npm install
RUN npm install -g @vue/cli@latest
RUN npm run-script build

FROM nginx
COPY nginx.config /etc/nginx/conf.d/default.conf
COPY --from=builder /var/app/dist/ /usr/share/nginx/html
