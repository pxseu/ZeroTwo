import Server, { guildConf } from "../models/server";
import events from "./events";
import {
	bypassIds,
	bannedIds,
	embedColorError,
	embedColorInfo,
} from "./config";
import { MessageEmbed, Collection, Message } from "discord.js";
import { client } from "..";

const cooldowns = new Collection();

const mainMessageHandler = () => {
	client.on(events.MESSAGE, async (message: Message) => {
		if (
			message.channel.type == "dm" ||
			!message.guild ||
			message.author.bot
		)
			return;

		const guildConf = (await Server.findOne({
			serverid: message.guild.id,
		})) as guildConf;

		message.guildConf = guildConf;

		if (
			message.content
				.toLowerCase()
				.indexOf(guildConf.prefix.toLowerCase()) !== 0
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
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
			);
		if (!command) return message.react("❌");

		console.log(
			`> ${commandName} | summoned by ${message.author.id} in ${message.guild.id}`,
		);

		if (bannedIds.some((id: string) => id == message.author.id) == true) {
			const embed = new MessageEmbed();
			embed.setDescription(
				`<@${message.author.id}>, 
				You have been permanetly banned from using this bot.`,
			);
			embed.setColor(embedColorError);
			return message.reply(embed);
		}

		if (
			Object.keys(bypassIds).some(
				(id: string) => id == message.author.id,
			) == false
		) {
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamps: any = cooldowns.get(command.name);
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
							}\` command.`,
						);
						embed.setColor(embedColorInfo);
						return message.reply(embed);
					}
				}
			}

			timestamps.set(message.author.id, now);
			setTimeout(
				() => timestamps.delete(message.author.id),
				cooldownAmount,
			);
		}

		try {
			command.execute(message, args);
		} catch (error) {
			const embed = new MessageEmbed();
			embed.setColor(embedColorError);
			embed.setDescription(
				`There was an error trying to execute that command!`,
			);
			message.channel.send(embedColorError);
			console.error(error);
		}
	});
};

export default mainMessageHandler;
