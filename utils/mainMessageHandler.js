const Server = require('../models/server');
const events = require('../utils/events');
let queue = new Map();

const mainMessageHandler = (client) => {
	client.on(events.MESSAGE, async (message) => {
		if (!message.guild || message.author.bot) return;
		const guildConf = await Server.findOne({
			serverid: message.guild.id,
		});
		if (
			message.content.toLowerCase().indexOf(guildConf.prefix.toLowerCase()) !==
			0
		)
			return;
		const args = message.content
			.slice(guildConf.prefix.length)
			.trim()
			.split(/ +/g);
		const commandName = args.shift().toLowerCase();
		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);
		if (!command) return message.react('❌');
		const serverQueue = queue.get(message.guild.id);
		console.log(`${commandName} | summoned by ${message.author.id}`);
		try {
			command.execute(
				message,
				args,
				guildConf,
				serverQueue,
				queue,
				client,
				Server
			);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	});
};

module.exports = mainMessageHandler;
