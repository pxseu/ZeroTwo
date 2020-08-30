const { MessageEmbed } = require("discord.js");
const { getImage } = require("../utils/apiStuff");

module.exports = {
	name: "neko",
	description: "Random neko!",
	async execute(message, args) {
		const endpoints = ["/ngif", "/neko"];
		const neko = await getImage(
			endpoints[Math.floor(Math.random() * endpoints.length)]
		);

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(neko.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ["catgirl", "catgirls", "nekos"],
};
