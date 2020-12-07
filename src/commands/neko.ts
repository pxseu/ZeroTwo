import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";
import { embedColor } from "../utils/config";

module.exports = {
	name: "neko",
	description: "Random neko!",
	async execute(message: Message) {
		const neko = await getImage("/neko");

		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setDescription(this.description);
		embed.setImage(neko.url);
		embed.setFooter(neko.api);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["catgirl", "catgirls", "nekos"],
} as Command;
