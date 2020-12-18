require("dotenv").config();

import fs from "fs";
import { Client, Collection } from "discord.js";
import database from "./utils/database";
import music from "./utils/music";
import guildStuff from "./utils/guildStuff";
import mainMessageHandler from "./utils/mainMessageHandler";
import slashCommands from "./utils/slashCommands";
/* import { startWeb } from "./web"; */

export const client = new Client();

client.commands = new Collection();
client.player = music();

const commandFiles = fs.readdirSync("./dist/commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

process.on("uncaughtException", function (err) {
	console.log("Caught exception: " + err);
});

(async () => {
	guildStuff();
	mainMessageHandler();
	await database();
	await client.login(process.env.BOT_TOKEN);
	await slashCommands();
	//await startWeb();
})();
