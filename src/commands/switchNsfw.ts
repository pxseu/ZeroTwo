import { Message, MessageEmbed } from "discord.js";
import { client } from "..";
import { creator, embedColorError, embedColorInfo } from "../utils/config";

module.exports = {
	name: "nfswglobal",
	description: "Master Switch for nsfw commands!",
	execute(message: Message) {
		const embed = new MessageEmbed();

		if (message.author.id != creator) {
			embed.setColor(embedColorError);
			embed.setDescription("Not allowed.");
			return message.channel.send(embed);
		}

		client.nsfw = !client.nsfw;
		embed.setColor(embedColorInfo);
		embed.setDescription("Not allowed.");
		return message.channel.send(embed);
	},
	type: 0,
};
