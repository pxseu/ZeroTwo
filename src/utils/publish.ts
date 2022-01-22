import axios from "axios";
import { DISCORD_BOT_VERSION, DISCORD_TOKEN } from "./config.js";
import { Command } from "../classes/Command.js";
import { logging as logging } from "./log.js";

const logger = logging("PUBLISH");

const config = {
	headers: {
		Authorization: `Bot ${DISCORD_TOKEN}`,
		"user-agent": `DiscordBot (+https://github.com/pxseu/zerotwo, ${DISCORD_BOT_VERSION}) ZeroTwo`,
	},
};

export const publish = async (application: string, commands: Command[], guild?: string): Promise<void> => {
	const url = guild
		? `https://discordapp.com/api/v8/applications/${application}/guilds/${guild}/commands`
		: `https://discordapp.com/api/v8/applications/${application}/commands`;

	const old = await axios.get<(Command & { id: string })[]>(url, config);

	// check for commands that are not in the old list and add them
	const toRemove = old.data.filter((o) => !commands.some((n) => n.name === o.name));

	// check for commands that are in the old and new list and update them and they are different
	const toUpdate = old.data.filter((o) => commands.some((n) => n.name === o.name));

	// check for commands that are in the new list and not in the old list and add them
	const newCommands = commands.filter((c) => !old.data.some((o) => o.name === c.name));

	// remove commands that are not in the new list
	if (toRemove.length) {
		await Promise.all(toRemove.map((c) => axios.delete(`${url}/${c.id}`, config)));

		logger.log("Removed", toRemove.length, "commands");
	}

	// update commands that are in the new list
	if (toUpdate.length) {
		await Promise.all(
			toUpdate.map((c) =>
				axios.patch(`${url}/${c.id}`, commands.find((n) => n.name === c.name)!.toJSON(), config),
			),
		);

		logger.log("Updated", toUpdate.length, "commands");
	}

	// add commands that are in the new list
	if (newCommands.length) {
		await Promise.all(newCommands.map((c) => axios.post(url, c, config)));

		logger.log("Created", newCommands.length, "commands");
	}

	logger.log("Published", commands.length, "commands");
};

export const unpublish = async (application: string, guild: string): Promise<void> => {
	// base path
	const base = `https://discordapp.com/api/v8/applications/${application}/guilds/${guild}/commands`;

	// get old commands
	const commands = await axios.get(base, config);

	// if no commands, return
	if (!commands.data.length) return;

	// delete commands
	for (const command of commands.data) {
		await axios.delete(`${base}/${command.id}`, config);
	}

	logger.log("Unpublished", commands.data.length, "commands");
};
