const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "links",
	description: "Links to my stuff!",
	execute(message, args) {
		const embed = new MessageEmbed();
		embed.setTitle(this.description);
		embed.setDescription(
			"My Website: [https://www.pxseu.com](https://www.pxseu.com)\n" +
				"My bot: [https://github.com/pxseu/ZeroTwoBot](https://github.com/pxseu/ZeroTwoBot)"
		);
		embed.setColor("RANDOM");

		message.channel.send(embed);
	},
	type: 5,
	aliases: ["link", "website", "homepage"],
};
