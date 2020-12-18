import { Message } from "discord.js";
import { client } from "..";

type prefixOrRegexReturn = {
	match: string;
	/* type: "mention" | "prefix"; */
};

type returnVals = [string[], string, Command | undefined] | null;

export const prefixOrRegex = (message: Message): prefixOrRegexReturn | null => {
	const regexp = new RegExp(`<@!?${message.client.user?.id}>`, "gi");
	const lowerCaseMessage = message.content.toLowerCase().trim();

	if (lowerCaseMessage.indexOf(message.guildConf.prefix.toLowerCase()) == 0) {
		return { match: message.guildConf.prefix /* , type: "prefix"  */ };
	}
	const regexMatch = lowerCaseMessage.match(regexp);

	if (regexMatch && lowerCaseMessage.startsWith(regexMatch[0])) {
		return { match: regexMatch[0] /* , type: "mention" */ };
	}
	return null;
};

export const getValues = (message: Message, prefixOrRegexMatch: string): returnVals => {
	const args = message.content.slice(prefixOrRegexMatch.length).trim().split(/ +/g);
	const commandName = args.shift()!.toLowerCase();
	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => !!cmd.aliases && cmd.aliases.includes(commandName));

	return [args, commandName, command];
};
