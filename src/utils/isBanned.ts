import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { bannedIds, embedColorError } from "./config";

export const banCheck = (message: Message): boolean => {
	if (bannedIds.some((id: string) => id == message.author.id) == true) {
		const embed = new MessageEmbed();
		embed.setDescription(
			`<@${message.author.id}>, 
            You have been permanetly banned from using this bot.`
		);
		embed.setColor(embedColorError);
		message.reply(embed);
		return true;
	}
	return false;
};
