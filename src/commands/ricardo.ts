import { Message, MessageEmbed } from "discord.js";
import { embedColor } from "../utils/config";

module.exports = {
	name: "ricardo",
	description: "Ricardo!",
	execute(message: Message) {
		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setTitle(`Ricardo has been summoned by <@${message.author.id}>.`);
		embed.setImage(
			"https://media.giphy.com/media/UtcBRO8cxulRzkrVLc/giphy.gif",
		);
		message.channel.send(embed);
	},
	type: 3,
};
