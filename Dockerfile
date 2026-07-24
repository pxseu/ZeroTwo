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

ARG YT_DLP_VERSION=2026.07.04

RUN apk add --no-cache ca-certificates curl deno ffmpeg python3 \
	&& curl -fsSL "https://github.com/yt-dlp/yt-dlp/releases/download/${YT_DLP_VERSION}/yt-dlp" \
		-o /usr/local/bin/yt-dlp \
	&& curl -fsSL "https://github.com/yt-dlp/yt-dlp/releases/download/${YT_DLP_VERSION}/SHA2-256SUMS" \
		-o /tmp/yt-dlp-checksums \
	&& grep " yt-dlp$" /tmp/yt-dlp-checksums > /tmp/yt-dlp-checksum \
	&& cd /usr/local/bin \
	&& sha256sum -c /tmp/yt-dlp-checksum \
	&& chmod +x /usr/local/bin/yt-dlp \
	&& yt-dlp --version \
	&& rm /tmp/yt-dlp-checksum /tmp/yt-dlp-checksums

COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json

CMD ["bun", "run", "."]
