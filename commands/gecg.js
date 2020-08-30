const { MessageEmbed } = require("discord.js");
const getImage = require("../utils/getImage");

module.exports = {
	name: "gecg",
	description: "Memes for catgirls!",
	async execute(message, args) {
		const gecg = await getImage("/gecg");

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(gecg.url);
		message.channel.send(embed);
	},
	type: 6,
};
