import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { embedColorError, embedColorInfo } from "./config";

Message.prototype.error = async function (message): Promise<void> {
	const embed = new MessageEmbed();
	embed.setColor(embedColorError);
	embed.setTimestamp();
	embed.setAuthor(
		this.member.user.username,
		this.member.user.displayAvatarURL({ dynamic: true })
	);

	if (typeof message == "object") {
		const { title, text, footer } = message;
		if (title) embed.setTitle(title);
		if (text) embed.setDescription(text);
		if (footer) embed.setFooter(footer);
	} else {
		embed.setTitle("Error");
		embed.setDescription(message);
	}

	return this.channel.send(embed);
};

Message.prototype.info = async function (message): Promise<void> {
	const embed = new MessageEmbed();
	embed.setColor(embedColorInfo);
	embed.setTimestamp();
	embed.setAuthor(
		this.member.user.username,
		this.member.user.displayAvatarURL({ dynamic: true })
	);

	if (typeof message == "object") {
		const { title, text, footer } = message;
		if (title) embed.setTitle(title);
		if (text) embed.setDescription(text);
		if (footer) embed.setFooter(footer);
	} else {
		embed.setDescription(message);
	}

	return this.channel.send(embed);
};
