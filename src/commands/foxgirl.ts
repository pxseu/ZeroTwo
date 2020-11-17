import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";

module.exports = {
	name: "foxgirl",
	description: "Memes for catgirls!",
	async execute(message: Message) {
		const foxgirl = await getImage("/fox");

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(foxgirl.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ["kitsune", "fox_girl"],
};
