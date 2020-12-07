import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { DEV_MODE, embedColorInfo } from "./config";

export const mentionBotCheck = (message: Message) => {
	const regexp = new RegExp(`^<@!?${message.client.user.id}>$`, "gi");

	if (message.content.match(regexp)) {
		const prefix = `${DEV_MODE ? "d" : ""}${message.guildConf.prefix}`;

		const embed = new MessageEmbed();
		let dsc = "Hewwo!\n";
		dsc += "My name is Zero Two and I'm your friendly discord bot!\n";
		dsc += `My prefix is \`${prefix}\`!\n`;
		dsc += `Use \`${prefix}help\` to list all commands!`;
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
