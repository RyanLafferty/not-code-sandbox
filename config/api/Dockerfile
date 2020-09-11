FROM alpine:latest

ARG PORT=8080
ARG SANDBOX_DIR='/sandbox'

RUN apk add --update ruby go nodejs yarn

COPY app /app
RUN mkdir ${SANDBOX_DIR}
WORKDIR /app

RUN yarn install

CMD ["yarn", "start"]
