"use strict";

require("dotenv").config();

import fs from "fs";
import { Client, Collection } from "discord.js";
import database from "./utils/database";
//const music = require("./utils/music");
//const database = require("./utils/database");
//const guildStuff = require("./utils/guildStuff");
//const mainMessageHandler = require("./utils/mainMessageHandler");
import mainMessageHandler from "./utils/mainMessageHandler";
import events from "./utils/events";

export const client = new Client();

client.commands = new Collection();
//client.player = music(client);

const commandFiles = fs
	.readdirSync("./dist/commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on(events.READY, () => {
	console.log(`> Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		status: "dnd",
		activity: {
			name: "help | pxseu.com",
			type: "STREAMING",
			url: "https://www.twitch.tv/monstercat",
		},
	});
});

//guildStuff(client);
mainMessageHandler();

database().then(() => {
	client.login(process.env.BOT_TOKEN);
});
