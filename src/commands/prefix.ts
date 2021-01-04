import { MessageEmbed } from "discord.js";
import { bypassIds, embedColor, embedColorError, embedColorInfo } from "../utils/config";

module.exports = {
	name: "prefix",
	description: "Set the prefix for the bot",
	async execute(message, args) {
		const embed = new MessageEmbed();
		embed.setTitle("Prefix!");
		embed.setColor(embedColorInfo);
		embed.setThumbnail(message.client.user.avatarURL({ dynamic: true }));
		embed.setAuthor(
			message.member.user.username,
			message.member.user.avatarURL({ dynamic: true })
		);
		embed.setTimestamp();

		if (args.length < 1) {
			let desc = `My prefix is \`${message.guildConf.prefix}\`\n`;
			desc += `To change it simply do: \`${message.guildConf.prefix} prefix <NEW PREFIX>\``;
			embed.setDescription(desc);
			message.channel.send(embed);
			return;
		}

		if (
			!(
				message.member.hasPermission("ADMINISTRATOR") ||
				message.member.hasPermission("MANAGE_GUILD") ||
				Object.keys(bypassIds).some((id) => id == message.author.id)
			)
		) {
			embed.setDescription("Not allowed!");
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}

		const newPrefix = args.join(" ");
		const regex = /^[*:$!-_.,?/=+a-zA-Z]{1,8}$/gi;

		if (!regex.test(newPrefix)) {
			embed.setDescription(`Prefix must match this pattern:\n\`${regex}\``);
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}
		try {
			await message.guildConf
				.updateOne({
					prefix: newPrefix,
				})
				.exec();
		} catch (e) {
			embed.setDescription(`Failed to set prefix.`);
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}

		embed.setDescription(`Set prefix to: \`${newPrefix}\``);
		embed.setColor(embedColor);
		message.channel.send(embed);
	},
	type: 0,
} as Command;
