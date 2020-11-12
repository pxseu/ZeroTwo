import { Message, MessageEmbed } from "discord.js";

module.exports = {
	name: "links",
	description: "Links to my stuff!",
	execute(message: Message) {
		const embed = new MessageEmbed();
		embed.setTitle(this.description);
		embed.setDescription(
			"My Website: [https://www.pxseu.com](https://www.pxseu.com) ✨\n" +
				"My bot: [https://github.com/pxseu/ZeroTwoBot](https://github.com/pxseu/ZeroTwoBot) 😳",
		);
		embed.setFooter("requested by Peitho");
		embed.setColor("RANDOM");

		message.channel.send(embed);
	},
	type: 0,
	aliases: ["link", "website", "homepage"],
};
