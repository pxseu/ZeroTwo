import { MessageEmbed } from "discord.js";
import { embedColor } from "../../utils/config";

module.exports = {
	name: "yuno",
	description: "Yuno!",
	execute(message) {
		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setDescription(`Yuno will protect <@${message.author.id}>.`);
		embed.setImage("https://media.giphy.com/media/a6wJ2bJ0127K0/source.gif");
		message.channel.send(embed);
	},
	type: 3,
} as Command;
