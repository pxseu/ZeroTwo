const { MessageEmbed } = require('discord.js');
const { commandsCattegories } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Please enter a number from 1-3',
	execute(message, args, guildConf, serverQueue, queue, client) {
		let user = message.member;

		const embed = new MessageEmbed()
			.setAuthor(
				user.user.username,
				user.user.displayAvatarURL({ dynamic: true })
			)
			.setColor('RANDOM')
			.setThumbnail(user.user.displayAvatarURL())
			.setFooter(message.guild.name, message.guild.iconURL())
			.setTimestamp();

		if (args == undefined || args[0] == undefined) {
			embed.setTitle('**Cattegories:**');
			let description = ``;

			Object.keys(commandsCattegories).forEach(function eachKey(key) {
				description += `${key}. `;
				description += `\`\`${commandsCattegories[key]}\`\`\n`;
			});
			description += `\nUsage: \`\`zt!help [cattegory number]\`\``;

			embed.setDescription(description);
		} else {
			if (getCommandType(args[0]) == undefined) {
				embed.setTitle('**Results:**');
				embed.setDescription('This cattegory does not exist.');
			} else {
				const cattegory = getCommandType(args[0]);
				const cattegoryName = commandsCattegories[cattegory].toLowerCase();
				embed.setTitle(`Cattegory: ${cattegory} (${cattegoryName})`);
				client.commands
					.filter((command) => command.type == cattegory)
					.forEach((command) => {
						embed.addField(
							`${guildConf.prefix}${command.name}`,
							command.description
						);
					});
			}
		}

		return message.channel.send(embed);
	},
	type: 0,
};

function getCommandType(string = '') {
	switch (string) {
		case '0':
			return 0;
		case '1':
			return 1;
		case '2':
			return 2;
		case '3':
			return 3;
		case '4':
			return 4;
		default:
			return undefined;
	}
}
