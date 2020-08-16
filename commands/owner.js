const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'owner',
	description: 'Owner!',
	execute(message, args) {
		const embed = new MessageEmbed();
		embed.setDescription(`My owner is \`\`pxseu#0001\`\`\n[My owners website](https://www.pxseu.com)`);
		message.channel.send(embed);
	},
	type: 0
};