# [ZeroTwo](https://github.com/pxseu/ZeroTwo)

[![forthebadge](https://forthebadge.com/images/badges/built-by-developers.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/fixed-bugs.svg)](https://forthebadge.com)

## About

This repo contains the full content of my discord bot for free! (under a license)
Please check it out and contribute if you wish to do so!

## Installation

This project uses [Bun](https://bun.sh) as the runtime and package manager.
Install Bun from [bun.sh](https://bun.sh).

Music playback also requires [`yt-dlp`](https://github.com/yt-dlp/yt-dlp),
[`ffmpeg`](https://ffmpeg.org/), and a
[supported JavaScript runtime](https://github.com/yt-dlp/yt-dlp/wiki/EJS) to be
available on `PATH`. The Docker image installs these automatically. Set
`YT_DLP_PATH` if the executable has a custom location.

## Development

```sh
# .env
DISCORD_TOKEN = # your bot token
IMPERIAL_TOKEN = # your imperial token
$ bun install
$ bun run dev
```
