import "./utils/extenders";

import { config } from "dotenv";
import { Client } from "discord.js";
import database from "./utils/bot/database";
import guildStuff from "./utils/bot/guildStuff";
import mainMessageHandler from "./utils/commands/mainMessageHandler";
//import slashCommands from "./utils/commands/slashCommands";
import player from "./utils/bot/player";
import loadCommands from "./utils/commands/commandLoader";

config();

export const client = new Client();

setInterval(() => {
	let totalSeconds = client.uptime / 1000;
	const days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);

	let uptime = days > 0 ? `${days} days, ` : "";
	uptime += hours > 0 ? `${hours} hours, ` : "";
	uptime += minutes > 0 ? `${minutes} minutes, ` : "";
	uptime += seconds > 0 ? `${seconds} seconds` : "";
	uptime = uptime.trimEnd();
	uptime;
	//console.log(uptime);
}, 200);

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
