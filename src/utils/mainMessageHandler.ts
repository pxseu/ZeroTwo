import Server, { guildConf } from "../models/server";
import events from "./events";
import { bannedIds, embedColorError, DEV_MODE } from "./config";
import { MessageEmbed, Collection, Message } from "discord.js";
import { client } from "..";
import { mentionBotCheck } from "./mentionedBot";
import { rateLimit } from "./rateLimit";

export const cooldowns = new Collection();

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

		if (mentionBotCheck(message)) return;

		const prefix = `${DEV_MODE ? "d" : ""}${guildConf.prefix}`;

		if (message.content.toLowerCase().indexOf(prefix.toLowerCase()) !== 0)
			return;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift().toLowerCase();
		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
			);
		if (!command) return message.react("❌");

		console.log(
			`> ${commandName} > summoned by ${message.author.id} in ${message.guild.id}`,
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

		if (rateLimit(message, command)) return;

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
