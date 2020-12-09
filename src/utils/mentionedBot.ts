import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { embedColorInfo } from "./config";

export const mentionOnlyCheck = (message: Message) => {
	const regexp = new RegExp(`^<@!?${message.client.user.id}>$`, "gi");

	if (message.content.match(regexp)) {
		const embed = new MessageEmbed();
		let dsc = "Hewwo!\n";
		dsc += "My name is Zero Two and I'm your friendly discord bot!\n";
		dsc += `My prefix is \`${message.guildConf.prefix}\`!\n`;
		dsc += `Use \`${message.guildConf.prefix} help\` to list all commands!`;
		embed.setDescription(dsc);
		embed.setColor(embedColorInfo);
		embed.setThumbnail(message.client.user.avatarURL({ dynamic: true }));
		embed.setFooter(`You're pretty!`);
		embed.setAuthor(
			message.member.user.username,
			message.member.user.avatarURL({ dynamic: true }),
		);
		embed.setTimestamp();

		message.channel.send(embed);
		return true;
	}

	return false;
};
