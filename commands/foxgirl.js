const { MessageEmbed } = require("discord.js");
const getImage = require("../utils/getImage");

module.exports = {
	name: "foxgirl",
	description: "Memes for catgirls!",
	async execute(message, args) {
		const foxgirl = await getImage("/fox_girl");

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(foxgirl.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ["kitsune", "fox_girl"],
};
