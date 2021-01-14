import { readdirSync } from "fs";
import { Collection } from "discord.js";

export default async (): Promise<Collection<string, Command>> => {
	const commands = new Collection<string, Command>();

	const commandsFiles = readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));

	console.log(`> Found ${commandsFiles.length} command(s)`);

	for (const file of commandsFiles) {
		const command: Command = await import(`../../commands/${file}`);

		commands.set(command.name, command);
	}

	return commands;
};
