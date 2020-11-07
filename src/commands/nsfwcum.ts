import { MessageEmbed, Message } from "discord.js";
import { getImage } from "../utils/apiStuff";

module.exports = {
	name: "cum",
	description: "Cum!",
	async execute(message: Message) {
		return message.channel.send("No");

		const cum = await getImage("/cum");
		const embed = new MessageEmbed();

		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(cum.url);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["creampie", "nut"],
};
