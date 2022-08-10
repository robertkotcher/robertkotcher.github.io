FROM python:3.11-rc-alpine3.14
WORKDIR /app
COPY . .
EXPOSE 80
CMD [ "python", "server.py" ]
