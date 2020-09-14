const { MessageEmbed } = require("discord.js");
const { commandsCategories } = require("../utils/config");

module.exports = {
	name: "help",
	description: `Please enter a number from 0-6`,
	execute(message, args, guildConf) {
		let user = message.member;

		const embed = new MessageEmbed()
			.setAuthor(
				user.user.username,
				user.user.displayAvatarURL({ dynamic: true })
			)
			.setColor("RANDOM")
			.setThumbnail(user.user.displayAvatarURL())
			.setFooter(message.guild.name, message.guild.iconURL())
			.setTimestamp();

		if (args == undefined || args[0] == undefined) {
			embed.setTitle("**Categories:**");
			let description = ``;

			Object.keys(commandsCategories).forEach(function eachKey(key) {
				description += `${key}. `;
				description += `\`\`${commandsCategories[key]}\`\`\n`;
			});
			description += `\nUsage: \`\`zt!help [category number]\`\``;

			embed.setDescription(description);
		} else {
			if (getCommandType(args[0]) == undefined) {
				embed.setTitle("**Results:**");
				embed.setDescription("This category does not exist.");
			} else {
				const cattegory = getCommandType(args[0]);
				const cattegoryName = commandsCategories[cattegory].toLowerCase();
				embed.setTitle(`Category: ${cattegory} (${cattegoryName})`);
				message.client.commands
					.filter((command) => command.type == cattegory)
					.forEach((command) => {
						embed.addField(
							`${guildConf.prefix}${command.name}`,
							command.description +
								(command.aliases
									? `\nAliases: \`\`${command.aliases.join("``, ``")}\`\``
									: "")
						);
					});
			}
		}

		embed.setFooter(
			`Proudly providing ${message.client.commands.array().length} commands!`
		);

		message.channel.send(embed);
	},
	type: 0,
};

function getCommandType(string = "") {
	try {
		const i = parseInt(string);
		return commandsCategories.hasOwnProperty(i) ? i : undefined;
	} catch (error) {
		return undefined;
	}
}
