import type { PresenceData } from "discord.js";
import { Client } from "discord.js";

export const DEV_MODE = process.env.NODE_ENV != "production";

export const creator = "338718840873811979";

export const embedColor = DEV_MODE ? "#6ab04c" : "#ff01ff";
export const embedColorInfo = "#7070ff";
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
	() => ({
		type: "LISTENING",
		name: "zt!help 📋",
	}),
	() => ({
		type: "STREAMING",
		name: "on pxseu.com 🌌",

		url: "https://www.twitch.tv/monstercat",
	}),
	() => ({
		type: "WATCHING",
		name: "your cute face ❤",
	}),
	() => ({
		type: "COMPETING" /* in */,
		name: "cuteness! 💕",
	}),

	(client) => ({
		type: "PLAYING",
		name: `with ${client.guilds.cache.size} servers! 🎮`,
	}),
] as ((client: Client) => PresenceData["activity"])[];

export const warnGifs = Object.freeze([
	"https://media.tenor.com/images/db94377ee10e67006d5ba5346fd0ee08/tenor.gif",
	"https://media.tenor.com/images/3a2f78e1097e5536ca9834004d64fa01/tenor.gif",
	"https://media.tenor.com/images/7f6ad3947216af3c388750b80635eb36/tenor.gif",
	"https://media.tenor.com/images/e9a427760fc32eb4d87602e8bbf86fff/tenor.gif",
	"https://media.tenor.com/images/5233f16377321b03a04c5236318d90eb/tenor.gif",
	"https://media.tenor.com/images/823652a01fa06322d698d7b452c25469/tenor.gif",
	"https://media.tenor.com/images/14eb32039f976c2bd9bb9eaa7b7f6473/tenor.gif",
	"https://media.tenor.com/images/980305a1555488b0b2982908f26d900d/tenor.gif",
	"https://media.tenor.com/images/921ec266a989d9e8553aafe16f1f6c9d/tenor.gif",
	"https://media.tenor.com/images/7e5a85cfbfef35505b41b62b41822935/tenor.gif",
	"https://media.tenor.com/images/51de84b66a36efa877c8fb034422c1fb/tenor.gif",
	"https://media.tenor.com/images/8aadd110ebcb4e714843a614fcbe2ee2/tenor.gif",
	"https://media.tenor.com/images/07778c672663d144c8ae4359de86db0f/tenor.gif",
]);
