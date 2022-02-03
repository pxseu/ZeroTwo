import { ArgumentDefinition, BaseCommand, Command, SubCommand } from "../classes/Command.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { Client, Collection } from "discord.js";
import { logging } from "./log.js";
import { DEV } from "./config.js";

const logger = logging("LOADER");

export const getCommands = async <T extends unknown>(
	client: Client,
	commands: Collection<string, Command | SubCommand>,
	path = "",
	parent: string[] | null = null,
): Promise<Collection<string, T>> => {
	const all = await readdir(join(process.cwd(), `/dist/commands/${path}`));
	const files = all.filter((file) => file.endsWith(".js"));
	const folders = all.filter((file) => file.split(".").length === 1);

	for (const file of files) {
		if (file === "index.js") continue;

		try {
			const command = await import(`file://${join(process.cwd(), `/dist/commands/${path}`, file)}`);
			const constructed = new command.default(client);

			if (!(constructed instanceof Command || constructed instanceof SubCommand)) {
				throw new Error(`'${file}' is not a Command`);
			}

			commands.set(constructed.name, constructed as Command);
		} catch (e) {
			if (!(e instanceof Error)) throw e;
			logger.warn(`Failed to load command '${file}': ${e.message}`);
			if (!DEV) throw e;
		}
	}

	for (const folder of folders) {
		try {
			const command = await import(`file://${join(process.cwd(), `/dist/commands/${path}`, folder, "index.js")}`);
			const constructed: Command | SubCommand = new command.default(client);

			if (!(constructed instanceof BaseCommand)) {
				throw new Error(`'${folder}/index.js' is not a Command`);
			}

			const subCommands = await getCommands<SubCommand>(client, constructed.subCommands, `${path}/${folder}`, [
				...(parent || []),
				constructed.name,
			]);

			constructed.subCommands = subCommands;

			constructed.options.push(...subCommands.map((sc) => sc.toJSON() as ArgumentDefinition));

			commands.set(constructed.name, constructed);
		} catch (e) {
			if (!(e instanceof Error)) throw e;
			logger.warn(`Failed to load command '${folder}/index.js': ${e.message}`);
			if (!DEV) throw e;
		}
	}

	for (const command of commands.values()) {
		if (command.buttonInteractions.size <= 0 && command.subCommands.size <= 0) continue;

		for (const [id, button] of command.buttonInteractions) {
			button.metadata.customId = client._zerotwo.handy.joinCommandId([...(parent || []), command.name], id);
		}

		for (const subCommand of command.subCommands.values()) {
			for (const [id, button] of subCommand.buttonInteractions) {
				button.metadata.customId = client._zerotwo.handy.joinCommandId(
					[...(parent || []), command.name, subCommand.name],
					id,
				);
			}
		}
	}

	return commands as any;
};
