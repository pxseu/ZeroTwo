const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'sex',
	description: 'No',
	execute(message, args) {
		message.channel.send('no');
	},
	type: 3,
	aliases: ['fuck', 'nut', 'hentai', 'nsfw', 'boobs'],
};
