import { MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";
import { embedColor } from "../utils/config";

module.exports = {
	name: "foxgirl",
	description: "Memes for catgirls!",
	async execute(message) {
		const foxgirl = await getImage("/fox");
		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setDescription(this.description);
		embed.setImage(foxgirl.url);
		embed.setFooter(foxgirl.api);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["kitsune", "fox_girl"],
} as Command;
