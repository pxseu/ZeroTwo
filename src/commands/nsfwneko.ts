import { MessageEmbed, Message } from "discord.js";
import { getImage, randomElement } from "../utils/apiStuff";

module.exports = {
	name: "nsfwneko",
	description: "NSFW Nekos!",
	async execute(message: Message) {
		return message.channel.send("No");

		/* const nsfwneko = await getImage("/hneko");

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(nsfwneko.url);
		message.channel.send(embed); */
	},
	type: 5,
	aliases: ["nneko"],
};
