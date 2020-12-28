import { MessageEmbed } from "discord.js";
import { unix } from "moment";
import { embedColor } from "../utils/config";

module.exports = {
	name: "guild",
	description: "Get data from the guild!",
	execute(message) {
		const embed = new MessageEmbed();

		const roles = message.guild.roles.cache.map((r) => `${r}`).join("_ _  |  _ _");

		embed.setTitle("Guild Info:");
		embed.addField("**\u200B**", "**\u200B**");
		embed.addField("Guild name:", `\`\`${clean(message.guild.name)}\`\``, true);
		embed.addField("Members:", `\`\`${message.guild.memberCount}\`\``, true);
		embed.addField("Owner:", `\`\`<@${message.guild.owner.id}>\`\``, true);
		embed.addField("**\u200B**", "**\u200B**");
		embed.addField("Server ID:", `\`\`${message.guild.id}\`\``, true);
		embed.addField(
			"Creation date:",
			`\`\`${clean(
				unix(message.guild.createdAt.getTime() / 1000).format("DD/MM/YYYY HH:mm:ss")
			)}\`\``,
			true
		);
		embed.addField("**\u200B**", "**\u200B**");
		embed.addField("Roles:", roles.length > 1024 ? `Too many roles to show.` : roles);

		embed.setColor(embedColor);
		embed.setThumbnail(message.guild.iconURL());
		message.channel.send(embed);
	},
	type: 1,
	cooldown: 5,
} as Command;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}
