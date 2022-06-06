FROM node:18-alpine AS installer

ENV NODE_ENV production

WORKDIR /app

ADD yarn.lock package.json /app/

RUN apk add --no-cache python3 py3-pip build-base

RUN \
    cd /app && \
    yarn install --frozen-lockfile --non-interactive

ADD . /app/

RUN \
    yarn build

FROM node:18-alpine

COPY --from=installer /app /app/

CMD [ "node" , "." ]
