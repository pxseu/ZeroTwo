const { MessageEmbed } = require("discord.js");
const { getImage } = require("../utils/apiStuff");

module.exports = {
	name: "boobs",
	description: "Boobies!",
	async execute(message, args) {
		const boobs = await getImage("/boobs");

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(boobs.url);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["boobies", "titties", "breasts", "tits", "bobis"],
};
