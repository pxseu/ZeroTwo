import "./utils/extenders";

import { config } from "dotenv";
import { Client } from "discord.js";
import database from "./utils/database";
import guildStuff from "./utils/guildStuff";
import mainMessageHandler from "./utils/mainMessageHandler";
import slashCommands from "./utils/slashCommands";
import player from "./utils/player";
import loadCommands from "./utils/commandLoader";
/* import { startWeb } from "./web"; */

config();

export const client = new Client();

client.commands = loadCommands();
client.player = player(client);

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
