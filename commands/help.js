const { MessageEmbed } = require("discord.js");
const { commandsCategories } = require("../utils/config");

module.exports = {
	name: "help",
	description: `Please enter a number from 0-6`,
	execute(message, args, guildConf) {
		const client = message.client;
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
				client.commands
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
		embed.setFooter(`Proudly providing ${cleint.commands.lenght} commands!`);
		message.channel.send(embed);
	},
	type: 0,
};

function getCommandType(string = "") {
	switch (string) {
		case "0":
			return 0;
		case "1":
			return 1;
		case "2":
			return 2;
		case "3":
			return 3;
		case "4":
			return 4;
		case "5":
			return 5;
		case "6":
			return 6;
		default:
			return undefined;
	}
}
