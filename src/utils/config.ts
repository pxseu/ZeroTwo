import { ActivitiesOptions, Client, Intents } from "discord.js";

export const INTENTS = new Intents([
	// guilds
	"GUILDS",
	"GUILD_BANS",
	"GUILD_MEMBERS",
	"GUILD_MESSAGES",
	"GUILD_PRESENCES",
	"GUILD_MESSAGE_REACTIONS",
	"GUILD_EMOJIS_AND_STICKERS",
	// dms
	"DIRECT_MESSAGES",
	"DIRECT_MESSAGE_REACTIONS",
]);

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";
export const IMPERIAL_TOKEN = process.env.IMPERIAL_TOKEN || "";
export const DISCORD_BOT_VERSION = process.env.DISCORD_BOT_VERSION || "v1.0.0";
export const DEV_GUILD = process.env.DEV_GUILD;
export const DEV = process.env.NODE_ENV !== "production";
export const ACTIVITIES = [
	async () => ({
		type: "LISTENING",
		name: "/help 📋",
	}),
	async () => ({
		type: "STREAMING",
		name: "on 02.pxseu.com 🌌",

		url: "https://www.twitch.tv/monstercat",
	}),
	async () => ({
		type: "WATCHING",
		name: "your cute face ❤",
	}),
	async () => ({
		type: "COMPETING" /* in */,
		name: "cuteness! 💕",
	}),

	// async (client) => ({
	// 	type: "PLAYING",
	// 	name: `with ${await client
	// 		.shard!.fetchClientValues("guilds.cache.size")
	// 		.then((arr) => arr.reduce((a, b) => a + b))} servers! 🎮`,
	// }),
] as ((client: Client) => Promise<ActivitiesOptions>)[];
export const PXSEU_API_URL = process.env.PXSEU_API_URL || "https://api.pxseu.com/v2/sendMessage";
