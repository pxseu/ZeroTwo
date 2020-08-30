const { MessageEmbed } = require("discord.js");
const getImage = require("../utils/getImage");

module.exports = {
	name: "cum",
	description: "Cum!",
	async execute(message, args) {
		const cum = await getImage("/cum");

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(cum.url);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["creampie", "nut"],
};
