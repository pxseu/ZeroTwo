import { Message, MessageEmbed } from "discord.js";

module.exports = {
	name: "ricardo",
	description: "Ricardo!",
	execute(message: Message) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setTitle(`Ricardo has been summoned by <@${message.author.id}>.`);
		embed.setImage(
			"https://media.giphy.com/media/UtcBRO8cxulRzkrVLc/giphy.gif",
		);
		message.channel.send(embed);
	},
	type: 3,
};
