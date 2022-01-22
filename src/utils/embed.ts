import { MessageEmbed, User } from "discord.js";

export const withUser = (user: User) => {
	return new MessageEmbed()
		.setAuthor({ name: user.tag, iconURL: user.avatarURL() ?? user.defaultAvatarURL })
		.setFooter({ text: "Serving since 2019" })
		.setTimestamp();
};
