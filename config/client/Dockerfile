FROM node:13.10-slim

WORKDIR /app

COPY client-server .
COPY client client

RUN yarn --cwd client install
RUN yarn --cwd client build

RUN mv client/dist dist
RUN yarn install

RUN rm -rf client

EXPOSE 8080
CMD ["app.js"]
