import { Command } from "../classes/Command.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { Client, Collection } from "discord.js";
import { logging } from "./log.js";
import { DEV } from "./config.js";

const logger = logging("LOADER");

export const getCommands = async (client: Client): Promise<Collection<string, Command>> => {
	const files = (await readdir(join(process.cwd(), "/dist/commands/"))).filter((file) => file.endsWith(".js"));

	const commands = new Collection<string, Command>();

	for (const file of files) {
		try {
			const command = await import(`file://${join(process.cwd(), "/dist/commands/", file)}`);
			const constructed = new command.default(client);

			if (!(constructed instanceof Command)) {
				throw new Error(`'${file}' is not a Command`);
			}

			commands.set(constructed.name, constructed);
		} catch (e) {
			if (!(e instanceof Error)) throw e;
			logger.warn(`Failed to load command '${file}': ${e.message}`);
			if (!DEV) throw e;
		}
	}

	return commands;
};
