import { Intents } from "discord.js";

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
