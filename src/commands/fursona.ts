import { MessageEmbed } from "discord.js";
import { embedColor } from "../utils/config";

module.exports = {
	name: "fursona",
	description: "Generate a random fursona!",
	execute(message) {
		const user = message.member;

		const embed = new MessageEmbed();
		embed.setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }));
		embed.setColor(embedColor);
		embed.setFooter(message.guild.name, message.guild.iconURL());
		embed.setTimestamp();
		embed.setImage(
			`https://thisfursonadoesnotexist.com/v2/jpgs-2x/seed${Math.floor(
				Math.random() * 100000
			)}.jpg`
		);
		message.channel.send(embed);
	},
	type: 3,
} as Command;
