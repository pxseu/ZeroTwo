FROM node:18.3.0-alpine AS installer

ENV NODE_ENV production

WORKDIR /app

ADD yarn.lock package.json /app/

RUN \
    cd /app && \
    yarn install --frozen-lockfile --non-interactive

ADD . /app/

RUN \
    yarn build

FROM node:18.3.0-alpine

COPY --from=installer /app /app/

CMD [ "node" , "." ]