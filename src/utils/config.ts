import { type ActivitiesOptions, type Client, Intents } from "discord.js";

export const INTENTS = new Intents([
	// guilds
	"GUILDS",
	"GUILD_BANS",
	"GUILD_MEMBERS",
	"GUILD_MESSAGES",
	"GUILD_PRESENCES",
	"GUILD_MESSAGE_REACTIONS",
	"GUILD_EMOJIS_AND_STICKERS",
	"GUILD_VOICE_STATES",
	// dms
	"DIRECT_MESSAGES",
	"DIRECT_MESSAGE_REACTIONS",
]);

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";
export const APPLICATION_ID = process.env.APPLICATION_ID || "";
export const IMPERIAL_TOKEN = process.env.IMPERIAL_TOKEN || "";
export const YT_DLP_PATH = process.env.YT_DLP_PATH || "yt-dlp";
export const DISCORD_BOT_VERSION = process.env.DISCORD_BOT_VERSION || "v1.0.0";
export const DEV_GUILD = process.env.DEV_GUILD;
export const DEV = process.env.NODE_ENV !== "production";
export const ACTIVITIES = [
	{
		type: "LISTENING",
		name: "/help 📋",
	},
	{
		type: "STREAMING",
		name: "on 02.pxseu.com 🌌",
		url: "https://www.twitch.tv/monstercat",
	},
	{
		type: "WATCHING",
		name: "your cute face ❤",
	},
	{
		type: "COMPETING" /* in */,
		name: "cuteness! 💕",
	},

	// async (client) => ({
	// 	type: "PLAYING",
	// 	name: `with ${await client
	// 		.shard!.fetchClientValues("guilds.cache.size")
	// 		.then((arr) => arr.reduce((a, b) => a + b))} servers! 🎮`,
	// }),
] as (((client: Client) => Promise<ActivitiesOptions> | ActivitiesOptions) | ActivitiesOptions)[];
export const PXSEU_API_URL = process.env.PXSEU_API_URL || "https://api.pxseu.com/v2/message";
