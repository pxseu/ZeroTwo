import { MessageEmbed, Message } from "discord.js";
import { getImage } from "../utils/apiStuff";

module.exports = {
	name: "boobs",
	description: "Boobies!",
	async execute(message: Message) {
		return message.channel.send("No");

		const boobs = await getImage("/boobs");
		const embed = new MessageEmbed();

		embed.setColor("RANDOM");
		embed.setDescription(this.description);
		embed.setImage(boobs.url);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["boobies", "titties", "breasts", "tits", "bobis"],
};
