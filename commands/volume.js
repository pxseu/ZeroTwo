const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'volume',
	description: 'Change bot audio play volume.',
	execute(message, args, guildConf, serverQueue) {
		const embed = new MessageEmbed();
		if (serverQueue == undefined) return message.reply('No song is playing.');
		const volume = args[0];
		if (!volume) {
			embed.setTitle('Please choose from:');
			embed.setDescription('\n``earrape``\n``normal``\n``silent``');
			embed.setColor('RANDOM');
			return message.channel.send(embed);
		}
		switch (volume.toLowerCase()) {
			case 'earrape':
				serverQueue.volume = 20;
				break;
			case 'normal':
				serverQueue.volume = 5;
				break;
			case 'silent':
				serverQueue.volume = 1;
				break;
			default:
				embed.setTitle('Please choose from:');
				embed.setDescription('\n``earrape``\n``normal``\n``silent``');
				embed.setColor('RANDOM');
				return message.channel.send(embed);
		}
		embed.setTitle('Volume set to:');
		embed.setDescription(`${volume}`);
		embed.setFooter('The volume will applied to the next song.');
		embed.setColor('RANDOM');
		message.channel.send(embed);
	},
	type: 4,
};
