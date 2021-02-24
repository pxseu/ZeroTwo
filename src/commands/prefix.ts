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
		embed.setAuthor(message.member.user.username, message.member.user.avatarURL({ dynamic: true }));
		embed.setTimestamp();

		if (args.length < 1) {
			message.info(
				"" +
					`My prefix is \`${message.guildConf.prefix}\`\n` +
					`To change it simply do: \`${message.guildConf.prefix} prefix <NEW PREFIX>\``
			);
			return;
		}

		if (
			!(
				message.member.hasPermission("MANAGE_GUILD") ||
				Object.keys(bypassIds).some((id) => id == message.author.id)
			)
		) {
			embed.setDescription("You don't have the permission to use this command.");
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
			message.error("Failed to set prefix.");
			return;
		}

		embed.setDescription(`Set prefix to: \`${newPrefix}\``);
		embed.setColor(embedColor);
		message.channel.send(embed);
	},
	type: 0,
} as Command;
