import { Message } from "discord.js";
import { bypassIds } from "./config";

export const bypass = (message: Message) => {
	if (Object.keys(bypassIds).some((id: string) => id == message.author.id)) {
		return true;
	}
	return false;
};
