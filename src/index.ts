import "./utils/extenders";

import { config } from "dotenv";
import fs from "fs";
import { Client, Collection } from "discord.js";
import database from "./utils/database";
import guildStuff from "./utils/guildStuff";
import mainMessageHandler from "./utils/mainMessageHandler";
import slashCommands from "./utils/slashCommands";
import player from "./utils/player";
/* import { startWeb } from "./web"; */

config();

export const client = new Client();

client.commands = new Collection();
client.player = player(client);

const commandFiles = fs.readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

process.on("uncaughtException", function (err) {
	console.log("Caught exception: " + err);
});

(async () => {
	guildStuff(client);
	mainMessageHandler(client);
	await database();
	await client.login(process.env.BOT_TOKEN);
	await slashCommands();
	//await startWeb();
})();
