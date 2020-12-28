import { MessageEmbed } from "discord.js";
import { commandsCategories, embedColor } from "../utils/config";

module.exports = {
	name: "help",
	description: `Please enter a number from 0-6`,
	execute(message, args) {
		const user = message.member;

		const embed = new MessageEmbed();
		embed.setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }));
		embed.setColor(embedColor);
		embed.setThumbnail(user.user.displayAvatarURL());
		embed.setFooter(message.guild.name, message.guild.iconURL());
		embed.setTimestamp();

		if (args == undefined || args[0] == undefined) {
			embed.setTitle("**Categories:**");
			let description = ``;

			Object.keys(commandsCategories).forEach(function eachKey(key) {
				description += `${key}. `;
				description += `\`\`${commandsCategories[key]}\`\`\n`;
			});
			description += `\nUsage: \`\`${message.guildConf.prefix} help [category number]\`\``;

			embed.setDescription(description);
		} else {
			const cattegory = getCommandType(args[0], commandsCategories);
			if (cattegory == undefined) {
				embed.setTitle("**Results:**");
				embed.setDescription("This category does not exist.");
			} else {
				const cattegoryName = commandsCategories[cattegory].toLowerCase();
				embed.setTitle(`Category: ${cattegory} (${cattegoryName})`);
				message.client.commands
					.filter((command) => command.type == cattegory)
					.forEach((command) => {
						embed.addField(
							`${message.guildConf.prefix} ${command.name}`,
							command.description +
								(command.aliases
									? `\nAliases: \`\`${
											message.guildConf.prefix
									  } ${command.aliases.join(
											"``, ``" + message.guildConf.prefix
									  )} \`\``
									: "")
						);
					});
			}
		}

		embed.setFooter(`Proudly providing ${message.client.commands.array().length} commands!`);

		message.channel.send(embed);
	},
	type: 0,
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
