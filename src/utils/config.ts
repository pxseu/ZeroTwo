import type { PresenceData } from "discord.js";
import { Client } from "discord.js";

export const DEV_MODE = process.env.NODE_ENV != "production";

export const creator = "338718840873811979";

export const embedColor = DEV_MODE ? "#6ab04c" : "#ff01ff";
export const embedColorInfo = "#7070ff";
export const embedColorError = "#ff3f3f";
export const embedColorStaff = "#F0E68C";

export const bypassIds = Object.freeze({
	/* Important */
	"338718840873811979": "Owner",
	/* ky5 */
	"724674729977577643": "I hate you so much",
});

export const bannedIds = Object.freeze(["192490421308489731"]);

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

export const events = Object.freeze({
	READY: "ready",
	MESSAGE: "message",
	GUILDCREATE: "guildCreate",
	GUILDDELETE: "guildDelete",
	GUILDMEMBERADD: "guildMemberAdd",
	GUILDMEMBERREMOVE: "guildMemberRemove",
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

export const warnDesc = Object.freeze([
	`Q. Have any friends 
        A. Yes 
        Q. What's your gender 
        A. Male 
        Q. Favorite hobbies besides games 
        A. Guitar 
        Q. What happens if your offline 
        A. Internet connection 
        If you want to add me on steam comment below and have a really good reson or I will DECLINE and I DON'T ACCPET PRIVET PROFILES but IDC if you have a or multipule VAC bans as long I see your profile then I will accpet.
        Online: feel free to talk to me or invite me to a game that I have 
        Away: at school or guitar lessons 
        Busy: cant do Jackshit right now or eating dinner 
        Looking to play: just invite me to a game what ever I'm doing
        Looking to trade: you'er welcome to trade me 
        Offline: Dont have internet or parentes are yelling 
        at me 
        In game: don't bother talking to me or inviting me to a game 
		and if I dont find respect in the comment secion YOU WILL BE BLOCKED and if you disrespect in my group after you join me or the other admins but if you post something funny and everyone smiles at it then you can stay in I also have a discord server so if you want to join you can same rules but one rule in my discord DON'T SPAM MEMES and Porno`,
	`Not gonna be active on Dlscord tonight. I'm meeting a girl (a real one) in half an hour (wouldn't expect a lot of you to understand anyway) so please don't DM me asking me where I am (im with the girl, ok) you'll most likely get aired because ill be with the girl (again I don't expect you to understand) shes actually really interested in me and its not a situation i can pass up for some meaningless Dlscord degenerates (because ill be meeting a girl, not that you really are going to understand) this is my life now. Meeting women and not wasting my precious time online, I have to move on from such simple things and branch out (you wouldnt understand)`,
]);
