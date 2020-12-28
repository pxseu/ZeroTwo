import { MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";
import { embedColor } from "../utils/config";

module.exports = {
	name: "gecg",
	description: "Memes for catgirls!",
	async execute(message) {
		const gecg = await getImage("/gecg");
		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setDescription(this.description);
		embed.setImage(gecg.url);
		embed.setFooter(gecg.api);
		message.channel.send(embed);
	},
	type: 5,
} as Command;
