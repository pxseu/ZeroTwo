import Axios from "axios";
import type { Command } from "./classes/Command.js";
import { ZeroTwo } from "./classes/ZeroTwo.js";
import {
	APPLICATION_ID,
	DEV,
	DEV_GUILD,
	DISCORD_BOT_VERSION,
	DISCORD_TOKEN,
} from "./utils/config.js";
import { logging } from "./utils/log.js";

const logger = logging("PUBLISH");

const API_VERSION = 10;

const axios = Axios.create({
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization: `Bot ${DISCORD_TOKEN}`,
		"user-agent": `DiscordBot (+https://github.com/pxseu/zerotwo, ${DISCORD_BOT_VERSION}) ZeroTwo`,
	},
});

const publish = async (commands: Command[], guild?: string): Promise<void> => {
	const url = guild
		? `https://discordapp.com/api/v${API_VERSION}/applications/${APPLICATION_ID}/guilds/${guild}/commands`
		: `https://discordapp.com/api/v${API_VERSION}/applications/${APPLICATION_ID}/commands`;

	const old = await axios.get<(Command & { id: string })[]>(url);

	// check for commands that are not in the old list and add them
	const toRemove = old.data.filter((o) => !commands.some((n) => n.name === o.name));

	// remove commands that are not in the new list
	if (toRemove.length) {
		await Promise.all(toRemove.map((c) => axios.delete(`${url}/${c.id}`)));

		logger.log("Removed", toRemove.length, "commands");
	}

	// publish all current commands
	if (commands.length) {
		await axios.put(url, commands);
	}

	logger.log("Published", commands.length, "commands");
};

const bot = await new ZeroTwo().loadCommands();

try {
	const commands = Array.from(bot.commands.values());

	if (DEV && DEV_GUILD) {
		await publish(commands, DEV_GUILD);
	} else {
		await publish(commands);
	}
} catch (e) {
	logger.error(e);
} finally {
	logger.log("Done");
	await bot.destroy();
}
