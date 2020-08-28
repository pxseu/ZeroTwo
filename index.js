require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const database = require('./utils/database');
const guildStuff = require('./utils/guildStuff');
const mainMessageHandler = require('./utils/mainMessageHandler');
const events = require('./utils/events');
//const { badword } = require('./badwords.json');

let client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command, command.description);
}

client.on(events.READY, () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		status: 'dnd',
		activity: {
			name: 'porn | pxseu.com',
			type: 'STREAMING',
			url: 'https://www.twitch.tv/monstercat',
		},
	});
});

guildStuff(client);
mainMessageHandler(client);

//verification lol
database(process.env.MONGODB_URI).then(() => {
	client.login(process.env.BOT_TOKEN);
});
