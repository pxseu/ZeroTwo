const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'waifu',
	description: 'Generate a random waifu!',
	execute(message, args, guildConf, serverQueue, queue, client) {
		const user = message.member;

		const embed = new MessageEmbed();
		embed.setAuthor(
			user.user.username,
			user.user.displayAvatarURL({ dynamic: true })
		);
		embed.setColor('RANDOM');
		embed.setFooter(message.guild.name, message.guild.iconURL());
		embed.setTimestamp();
		embed.setImage(
			`https://www.thiswaifudoesnotexist.net/example-${Math.floor(
				Math.random() * 100000
			)}.jpg`
		);
		return message.channel.send(embed);
	},
	type: 3,
};
