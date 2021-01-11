import fs from "fs";
import { Collection } from "discord.js";

export default (): Collection<string, Command> => {
	const commands = new Collection<string, Command>();

	const commandFiles = fs.readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));

	console.log(`> Found ${commandFiles.length} command(s)`);

	for (const file of commandFiles) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(`../commands/${file}`) as Command;
		commands.set(command.name, command);
	}

	return commands;
};
