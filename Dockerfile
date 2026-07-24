FROM oven/bun:1-alpine as builder

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps alpine-sdk python3

COPY . .

RUN bun install --frozen-lockfile

RUN apk del .build-deps

ARG APPLICATION_ID
ENV APPLICATION_ID ${APPLICATION_ID}

ARG DISCORD_TOKEN
ENV DISCORD_TOKEN ${DISCORD_TOKEN}

RUN bun run build

FROM oven/bun:1-alpine

WORKDIR /zerotwo

RUN apk add --no-cache deno ffmpeg yt-dlp yt-dlp-ejs

COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json

CMD ["bun", "run", "."]
