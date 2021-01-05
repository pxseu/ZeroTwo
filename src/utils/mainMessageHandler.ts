import { findOrCreate } from "../models/server";
import events from "./events";
import { embedColorError } from "./config";
import { MessageEmbed, Collection, Message } from "discord.js";
import { mentionOnlyCheck } from "./mentionedBot";
import { rateLimit } from "./rateLimit";
import { getValues, prefixOrRegex } from "./prefixOrRegex";
import { banCheck } from "./isBanned";
import { bypass } from "./bypass";
import { Client } from "discord.js";

export const cooldowns = new Collection<string, Collection<string, number>>();

const mainMessageHandler = (client: Client): void => {
	client.on(events.MESSAGE, async (message: Message) => {
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
			command.execute(message, args);
		} catch (error) {
			const embed = new MessageEmbed();
			embed.setColor(embedColorError);
			embed.setDescription(`There was an error trying to execute that command!`);
			message.channel.send(embedColorError);
			console.error(error);
		}
	});
};

export default mainMessageHandler;
