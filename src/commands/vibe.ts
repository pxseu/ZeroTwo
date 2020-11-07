import { MessageEmbed, Message } from "discord.js";

module.exports = {
	name: "vibe",
	description: "Vibin.",
	execute(message: Message) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(`Zero Two vibes with <@${message.author.id}>.`);
		embed.setImage(
			"https://64.media.tumblr.com/c98bae671e32921caeaa6e9ef9234015/tumblr_p8zk1gXu2y1t0lt8go1_540.gif",
		);
		message.channel.send(embed);
	},
	type: 3,
};
