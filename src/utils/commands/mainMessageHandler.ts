import { Client, Collection, Message } from "discord.js";
import { findOrCreate } from "../../models/server";
import { bypass } from "./bypass";
import { events } from "../config";
import { banCheck } from "./isBanned";
import { mentionOnlyCheck } from "./mentionedBot";
import { getValues, prefixOrRegex } from "./prefixOrRegex";
import { rateLimit } from "./rateLimit";
import { invalidateToken } from "../api/tokenFetcher";

export const cooldowns = new Collection<string, Collection<string, number>>();

const mainMessageHandler = (client: Client): void => {
	client.on(events.MESSAGE, async (message: Message) => {
		invalidateToken(message);
		if (message.channel.type == "dm" || !message.guild || message.author.bot) return;

		message.guildConf = await findOrCreate(message.guild.id);

		const prfxOrRgx = prefixOrRegex(message);
		if (prfxOrRgx == null) return;
		if (mentionOnlyCheck(message)) return;

		const [args, commandName, command] = getValues(message, prfxOrRgx.match);

		if (!command) return message.react("❌");

		console.log(`> ${commandName} > summoned by ${message.author.id} in ${message.guild.id}`);

		if (!bypass(message)) {
			if (banCheck(message)) return;
			if (rateLimit(message, command)) return;
		}

		try {
			await command.execute(message, args);
		} catch (error) {
			message.error(`There was an error trying to execute that command!`, 3000);
			console.error(error);
		}
	});
};

export default mainMessageHandler;
