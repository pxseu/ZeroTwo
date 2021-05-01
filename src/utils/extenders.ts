import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { embedColorError, embedColorInfo } from "./config";

Message.prototype.error = async function (message, deleteAfter): Promise<void> {
	const embed = new MessageEmbed();
	embed.setColor(embedColorError);
	embed.setTimestamp();
	// embed.setAuthor(this.member.user.username, this.member.user.displayAvatarURL({ dynamic: true }));

	if (typeof message == "object") {
		const { title, text, footer, thumbnail } = message;
		if (title ?? false) embed.setTitle(title);
		if (text ?? false) embed.setDescription(text);
		if (footer ?? false) embed.setFooter(footer);
		if (thumbnail ?? false) embed.setThumbnail(thumbnail);
		// if (message.author !== undefined) embed.setAuthor(message.author);
	} else {
		embed.setTitle("Error");
		embed.setDescription(message);
	}

	this.channel.send(embed).then((msg: Message) => {
		if (deleteAfter && !msg.deleted && !msg.deletable)
			msg.delete().catch(() => {
				/*  */
			});
	});
};

Message.prototype.info = async function (message, deleteAfter): Promise<void> {
	const embed = new MessageEmbed();
	embed.setColor(embedColorInfo);
	embed.setTimestamp();
	// embed.setAuthor(this.member.user.username, this.member.user.displayAvatarURL({ dynamic: true }));

	if (typeof message === "object") {
		const { title, text, footer, thumbnail } = message;
		if (title ?? false) embed.setTitle(title);
		if (text ?? false) embed.setDescription(text);
		if (footer ?? false) embed.setFooter(footer);
		if (thumbnail ?? false) embed.setThumbnail(thumbnail);
		// if (message.author !== undefined) embed.setAuthor(message.author);
	} else {
		embed.setDescription(message);
	}

	this.channel.send(embed).then((msg: Message) => {
		if (deleteAfter && !msg.deleted && !msg.deletable)
			msg.delete({ timeout: deleteAfter }).catch(() => {
				/*  */
			});
	});
};
