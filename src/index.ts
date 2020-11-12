require("dotenv").config();

import fs from "fs";
import { Client, Collection } from "discord.js";
import database from "./utils/database";
import music from "./utils/music";
import guildStuff from "./utils/guildStuff";
//const guildStuff = require("./utils/guildStuff");
import mainMessageHandler from "./utils/mainMessageHandler";

export const client = new Client();

client.commands = new Collection();
client.player = music();

const commandFiles = fs
	.readdirSync("./dist/commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//guildStuff(client);
(async () => {
	guildStuff();
	mainMessageHandler();
	await database();

	client.login(process.env.BOT_TOKEN);
})();