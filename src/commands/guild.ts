import { Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { embedColor } from "../utils/config";

module.exports = {
	name: "guild",
	description: "Get data from the guild! | **by Peitho**",
	execute(message: Message) {
		const embed = new MessageEmbed();

		const roles = message.guild.roles.cache
			.map((r) => `${r}`)
			.join("_ _  |  _ _");

		embed.setTitle("Guild Info:");
		embed.addField("**\u200B**", "**\u200B**");
		embed.addField(
			"Guild name:",
			`\`\`${clean(message.guild.name)}\`\``,
			true,
		);
		embed.addField(
			"Members:",
			`\`\`${message.guild.memberCount}\`\``,
			true,
		);
		embed.addField("**\u200B**", "**\u200B**");
		embed.addField("Server ID:", `\`\`${message.guild.id}\`\``, true);
		embed.addField(
			"Creation date:",
			`\`\`${clean(
				moment
					.unix(message.guild.createdAt.getTime() / 1000)
					.format("DD/MM/YYYY HH:mm:ss"),
			)}\`\``,
			true,
		);
		embed.addField("**\u200B**", "**\u200B**");
		embed.addField(
			"Roles:",
			roles.length > 1024 ? `too many roles to show.` : roles,
		);
		embed.setFooter("by Peitho <3 (thamk u cutie)");
		embed.setColor(embedColor);
		embed.setThumbnail(message.guild.iconURL());
		message.channel.send(embed);
	},
	type: 1,
	cooldown: 5,
};

function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}
