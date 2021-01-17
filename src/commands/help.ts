import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { commandsCategories } from "../utils/commands/cattegoriers";
import { defaultCooldown } from "../utils/commands/rateLimit";
import { embedColor } from "../utils/config";

const execute: Command["execute"] = (message, args) => {
	if (!args || !args[0]) {
		let description = ``;

		description += Object.keys(commandsCategories)
			.map((catt) => `\`${catt}.\` - \`${commandsCategories[catt]}\``)
			.join(",\n");

		description += `\n\nUsage: \`${message.guildConf.prefix} help [category number | command name]\``;

		message.info({ title: "**Categories:**", text: description, footer: footer(message) });
		return;
	} else {
		const cattegory = getCommandType(args[0], commandsCategories);

		console.log(cattegory);

		/* blah blah i want to allow 0 */
		if (cattegory === undefined) {
			const command =
				message.client.commands.get(args[0]) ||
				message.client.commands.find(
					(cmd) =>
						!!cmd.aliases &&
						(!!cmd.aliases.find((alias) => alias.toLowerCase() == args[0].toLowerCase()) ||
							!!(cmd.name.toLowerCase() == args[0].toLowerCase()))
				);

			if (!command) {
				message.info({ text: "I couldn't find that command or category!", footer: footer(message) });
				return;
			}

			let text = String();

			text += command.description ? `Description: \n\`${command.description}\`\n\n` : String();

			text +=
				command.aliases && command.aliases.length > 0
					? `Aliases: ${command.aliases.map((alias) => `\`${alias}\``).join(", ")}\n\n`
					: String();

			text +=
				command.args && command.args.length > 0
					? `Command arguments: \n${command.args
							.map((arg) => `\`${arg.name}\` - ${arg.desc}`)
							.join(",\n")}\n\n`
					: String();

			text += `Cooldown: \`${command.cooldown ?? defaultCooldown}\` second(s)`;

			message.info({ title: command.name, text });
			return;
		}

		const cattegoryName = commandsCategories[cattegory].toLowerCase();
		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setTimestamp();
		embed.setTitle(`Category: ${cattegory} (${cattegoryName})`);
		message.client.commands
			.filter((command) => command.type == cattegory)
			.forEach((command) => {
				embed.addField(command.name, command.description);
			});

		embed.setFooter(`Proudly providing ${message.client.commands.array().length} commands!`);
		message.channel.send(embed);
	}
};

module.exports = {
	name: "help",
	description: `This command.`,
	type: 0,
	aliases: ["h"],
	args: [
		{ name: "[category number | command name]", desc: "Searches the bot for provided cattegory or command name." },
	],
	execute,
} as Command;

type comCatt = typeof commandsCategories;

function getCommandType(string = "", commandsCategories: comCatt) {
	try {
		const i = parseInt(string);
		return Object.prototype.hasOwnProperty.call(commandsCategories, i) ? i : undefined;
	} catch (error) {
		return undefined;
	}
}

function footer(m: Message) {
	return `Proudly providing ${m.client.commands.array().length} commands!`;
}
