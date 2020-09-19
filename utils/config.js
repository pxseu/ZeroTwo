"use strict";

const commandsCategories = {
	0: "Commands for bot!",
	1: "User commands!",
	2: "Utility commands!",
	3: "Fun commands!",
	4: "Music commands!",
	5: "NSFW (for horny bastards)!",
	6: "Cute stuff here!",
};

const nsfwCategories = [5];

const patgifs = [
	"https://i.imgur.com/UWbKpx8.gif",
	"https://thumbs.gfycat.com/LightOilyIraniangroundjay-size_restricted.gif",
	"https://thumbs.gfycat.com/FlimsyDeafeningGrassspider-size_restricted.gif",
	"https://thumbs.gfycat.com/ImpurePleasantArthropods-small.gif",
	"https://i.pinimg.com/originals/c0/c1/c5/c0c1c5d15f8ad65a9f0aaf6c91a3811e.gif",
];

const huggifs = [
	"https://media.giphy.com/media/ddGxYkb7Fp2QRuTTGO/giphy.gif",
	"https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif",
	"https://i.pinimg.com/originals/74/b6/ae/74b6ae32345aad709bb0e41a6f867626.gif",
	"https://media.giphy.com/media/vTtibSrt4dlIc/giphy.gif",
	"https://media.giphy.com/media/ZQN9jsRWp1M76/giphy.gif",
	"https://media.giphy.com/media/u9BxQbM5bxvwY/giphy.gif",
];

const kissgifs = [
	"https://media2.giphy.com/media/bGm9FuBCGg4SY/giphy.gif",
	"https://i.imgur.com/i1PIph3.gif",
];

const bypassIds = [
	"338718840873811979",
	"343627503698706432",
	"714991222074376303",
];

const bannedIds = ["670600281846841354" /* Peitho lmao */];

const filters = {
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
};

module.exports = {
	commandsCategories,
	nsfwCategories,
	bypassIds,
	bannedIds,
	kissgifs,
	patgifs,
	huggifs,
	filters,
};
