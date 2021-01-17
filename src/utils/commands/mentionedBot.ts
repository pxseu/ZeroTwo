import { Message } from "discord.js";

export const mentionOnlyCheck = (message: Message): boolean => {
	const regexp = new RegExp(`^<@!?${message.client.user.id}>$`, "gi");

	if (message.content.match(regexp)) {
		const dsc =
			"Hewwo!\n" +
			`My name is ${message.client.user.username} and I'm your friendly discord bot!\n` +
			`My prefix is \`${message.guildConf.prefix}\`!\n` +
			`Use \`${message.guildConf.prefix} help\` to list all commands!`;

		message.info({
			thumbnail: message.client.user.avatarURL({ dynamic: true }),
			text: dsc,
			footer: `You're pretty!`,
		});

		return true;
	}

	return false;
};
