FROM node:18-alpine AS installer

WORKDIR /app

ADD yarn.lock package.json /app/

RUN apk add --no-cache python3 py3-pip build-base

RUN \
    cd /app && \
    yarn install --frozen-lockfile --non-interactive

ADD . /app/

RUN \
    yarn build

RUN yarn install --production --ignore-scripts --prefer-offline --force

FROM node:18-alpine

COPY --from=installer /app /app/

CMD [ "node" , "." ]
