const Server = require('../models/server');
const events = require('../utils/events');
const { nsfwCategories, bypassIds } = require('../utils/config');
const { MessageEmbed } = require('discord.js');
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
			if (nsfwCategories.some((type) => type == command.type)) {
				if (bypassIds.some((id) => id == message.author.id) == false) {
					if (!message.channel.nsfw) {
						const embed = new MessageEmbed();
						embed.setColor('RANDOM');
						embed.setDescription(
							'This command can only be used in channels marked nsfw.'
						);
						return message.channel.send(embed);
					}
				}
			}
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
