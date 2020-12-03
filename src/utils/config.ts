import type { PresenceData } from "discord.js";

export const DEV_MODE = process.env.NODE_ENV != "production";

export const creator = "338718840873811979";

export const embedColor = DEV_MODE ? "#6ab04c" : "#ff01ff";
export const embedColorInfo = "#3f3fff";
export const embedColorError = "#ff3f3f";
export const embedColorStaff = "#F0E68C";

export const commandsCategories = Object.freeze({
	0: "Commands for bot!",
	1: "User commands!",
	2: "Utility commands!",
	3: "Fun commands!",
	4: "Music commands!",
	5: "Cute stuff here!",
});

export const bypassIds = Object.freeze({
	/* Important */
	"338718840873811979": "Owner",
	/* Less important */
	"305765073689903104": "Menel",
	/* Even less important */
	"294936456252882946": "Przekonał @pxseu",
});

export const bannedIds = Object.freeze([]);

export const filters = Object.freeze({
	bassboost: "Bassboost",
	"8D": "8D",
	vaporwave: "Vaporwave",
	nightcore: "Nightcore",
	phaser: "Phaser",
	tremolo: "Tremolo",
	vibrato: "Vibrato",
	reverse: "Reverse",
	treble: "Treble",
	normalizer: "Normalizer",
	surrounding: "Surrounding",
	pulsator: "Pulsator",
	subboost: "Subboost",
	karaoke: "Karaoke",
	flanger: "Flanger",
	gate: "Gate",
	haas: "Haas",
	mcompand: "Mcompand",
});

export const endpoitFileds = Object.freeze({
	"https://nekos.life/api/v2/img/": "url",
	"https://asuna.ga/api/": "url",
	"https://nekobot.xyz/api/image?type=": "message",
});

export const endpoitsForApis = Object.freeze({
	"/gecg": {
		"https://nekos.life/api/v2/img/": ["gecg"],
	},
	"/hug": {
		"https://nekos.life/api/v2/img/": ["hug", "cuddle"],
		"https://asuna.ga/api/": ["hug"],
	},
	"/kiss": {
		"https://nekos.life/api/v2/img/": ["kiss"],
		"https://asuna.ga/api/": ["kiss"],
	},
	"/neko": {
		"https://nekos.life/api/v2/img/": ["neko", "ngif"],
		"https://asuna.ga/api/": ["neko"],
		"https://nekobot.xyz/api/image?type=": ["neko", "kemonomimi"],
	},
	"/slap": {
		"https://nekos.life/api/v2/img/": ["slap"],
		"https://asuna.ga/api/": ["slap"],
	},
	"/fox": {
		"https://nekos.life/api/v2/img/": ["fox_girl"],
	},
	"/pat": {
		"https://nekos.life/api/v2/img/": ["pat"],
		"https://asuna.ga/api/": ["pat"],
	},
});

export const botStatuses = [
	{
		type: "LISTENING",
		name: "zt!help 📋",
	},
	{
		type: "STREAMING",
		name: "on pxseu.com 🌌",

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
] as PresenceData["activity"][];
