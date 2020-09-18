"use strict";

const Server = require("../models/server");
const events = require("../utils/events");
const { nsfwCategories, bypassIds, bannedIds } = require("../utils/config");
const { MessageEmbed, Collection } = require("discord.js");

let queue = new Map();
const cooldowns = new Collection();

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
		if (!command) return message.react("❌");
		const serverQueue = queue.get(message.guild.id);
		console.log(`${commandName} | summoned by ${message.author.id}`);

		if (bannedIds.some((id) => id == message.author.id) == true) {
			const embed = new MessageEmbed();

			embed.setDescription(
				`<@${message.author.id}>, 
				You have been permanetly banned from using this bot.
				(uid: ${message.author.id})`
			);
			embed.setColor("RANDOM");

			return message.reply(embed);
		}
		if (bypassIds.some((id) => id == message.author.id) == false) {
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown || 3) * 1000;

			if (timestamps.has(message.author.id)) {
				if (timestamps.has(message.author.id)) {
					const expirationTime =
						timestamps.get(message.author.id) + cooldownAmount;

					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;

						const embed = new MessageEmbed();
						embed.setDescription(
							`<@${message.author.id}>, 
							Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
								command.name
							}\` command.`
						);
						embed.setColor("RANDOM");

						return message.reply(embed);
					}
				}
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			if (nsfwCategories.some((type) => type == command.type)) {
				if (!message.channel.nsfw) {
					const embed = new MessageEmbed();
					embed.setColor("RANDOM");
					embed.setDescription(
						"This command can only be used in channels marked nsfw."
					);
					return message.channel.send(embed);
				}
			}
		}

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
			message.reply("there was an error trying to execute that command!");
		}
	});
};

module.exports = mainMessageHandler;
