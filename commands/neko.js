const { MessageEmbed } = require("discord.js");
const { getImage, randomElement } = require("../utils/apiStuff");

module.exports = {
	name: "neko",
	description: "Random neko!",
	async execute(message, args) {
		const endpoints = ["/ngif", "/neko"];
		const neko = await getImage(randomElement(endpoints));

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(neko.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ["catgirl", "catgirls", "nekos"],
};
