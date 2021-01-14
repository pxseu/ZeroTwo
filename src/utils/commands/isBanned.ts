import { Message } from "discord.js";
import { bannedIds } from "../config";

export const banCheck = (message: Message): boolean => {
	if (bannedIds.some((id: string) => id == message.author.id) == true) {
		message.error(
			`<@${message.author.id}>,\n You have been permanetly banned from using this bot.`,
			2000
		);
		return true;
	}
	return false;
};
