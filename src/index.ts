import "dotenv/config";
import "./utils/extenders";

import { Client } from "discord.js";
import database from "./utils/bot/database";
import guildStuff from "./utils/bot/guildStuff";
import mainMessageHandler from "./utils/commands/mainMessageHandler";
//import slashCommands from "./utils/commands/slashCommands";
import player from "./utils/bot/player";
import loadCommands from "./utils/commands/commandLoader";

export const client = new Client();

process.on("uncaughtException", function (err) {
	console.log("Caught exception: " + err);
});

(async () => {
	client.commands = await loadCommands();
	client.player = player(client);
	guildStuff(client);
	mainMessageHandler(client);
	await database();
	await client.login(process.env.BOT_TOKEN);
	//await slashCommands();
	//await startWeb();
})();
