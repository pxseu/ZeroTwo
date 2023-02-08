FROM node:14-alpine as builder

RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

COPY . .

RUN yarn install --frozen-lockfile

RUN apk del .build-deps

RUN yarn build

FROM node:14-alpine

WORKDIR /zerotwo

COPY --from=builder dist dist
COPY --from=builder node_modules node_modules
COPY --from=builder package.json package.json

CMD ["node", "."]
