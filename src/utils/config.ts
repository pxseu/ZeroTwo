export const owner = "338718840873811979";

export const commandsCategories = Object.freeze({
	0: "Commands for bot!",
	1: "User commands!",
	2: "Utility commands!",
	3: "Fun commands!",
	4: "Music commands!",
	5: "NSFW (for horny bastards)!",
	6: "Cute stuff here!",
});

export const nsfwCategories = Object.freeze([5]);

export const bypassIds = Object.freeze([
	owner,
	"634774973201907714",
	"731111236036722698",
]);

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
		"https://nekobot.xyz/api/image?type=": ["neko", "kemonomimi"], // love you peitho
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
