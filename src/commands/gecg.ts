import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";

module.exports = {
	name: "gecg",
	description: "Memes for catgirls!",
	async execute(message: Message) {
		const gecg = await getImage("/gecg");
		const embed = new MessageEmbed();

		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(gecg.url);
		message.channel.send(embed);
	},
	type: 6,
};
