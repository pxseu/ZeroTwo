import { MessageEmbed, Message } from "discord.js";
import { getImage } from "../utils/apiStuff";
import { embedColor } from "../utils/config";

module.exports = {
	name: "cum",
	description: "Cum!",
	async execute(message: Message) {
		return message.channel.send("No");

		/* const cum = await getImage("/cum");
		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setDescription(this.description);
		embed.setImage(cum.url);
		message.channel.send(embed); */
	},
	type: 5,
	aliases: ["creampie", "nut"],
};
