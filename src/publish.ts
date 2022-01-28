import Axios from "axios";
import { DEV_GUILD, DISCORD_BOT_VERSION, DISCORD_TOKEN } from "./utils/config.js";
import { Command } from "./classes/Command.js";
import { logging as logging } from "./utils/log.js";
import { ZeroTwo } from "./classes/ZeroTwo.js";

const logger = logging("PUBLISH");

const API_VERSION = 9;

const axios = Axios.create({
	headers: {
		Authorization: `Bot ${DISCORD_TOKEN}`,
		"user-agent": `DiscordBot (+https://github.com/pxseu/zerotwo, ${DISCORD_BOT_VERSION}) ZeroTwo`,
	},
});

const publish = async (application: string, commands: Command[], guild?: string): Promise<void> => {
	const url = guild
		? `https://discordapp.com/api/v${API_VERSION}/applications/${application}/guilds/${guild}/commands`
		: `https://discordapp.com/api/v${API_VERSION}/applications/${application}/commands`;

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

const bot = new ZeroTwo(true);

try {
	await bot.login();
	await publish(bot.client.application!.id, Array.from(bot.commands.values()), DEV_GUILD);
} catch (e) {
	logger.error(e);
} finally {
	logger.log("Done");
	await bot.destroy();
}
