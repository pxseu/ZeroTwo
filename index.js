"use strict";

require("dotenv").config();

const fs = require("fs");
const Discord = require("discord.js");
const music = require("./utils/music");
const database = require("./utils/database");
const guildStuff = require("./utils/guildStuff");
const mainMessageHandler = require("./utils/mainMessageHandler");
const events = require("./utils/events");

let client = new Discord.Client();

client.commands = new Discord.Collection();
client.player = music(client);

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command, command.description);
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

guildStuff(client);
mainMessageHandler(client);

database(process.env.MONGODB_URI).then(() => {
	client.login(process.env.BOT_TOKEN);
});
