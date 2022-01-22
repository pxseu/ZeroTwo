import { ActivitiesOptions, Client, Intents } from "discord.js";

export const intents = new Intents([
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

	async (client) => ({
		type: "PLAYING",
		name: `with ${client.guilds.cache.size} servers! 🎮`,
	}),
] as ((client: Client) => Promise<ActivitiesOptions>)[];
