const { MessageEmbed } = require('discord.js');
const { ownerid } = require('../config.json');

module.exports = {
	name: 'owner',
	description: 'Owner!',
	execute(message, args) {
		const embed = new MessageEmbed();
		embed.setDescription(
			`My owner is \`\`pxseu#0001\`\`\n (${ownerid})[My owners website](https://www.pxseu.com)`
		);
		message.channel.send(embed);
	},
	type: 0,
	aliases: ['daddy', 'mybigboi'],
};
