const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'hug',
	description: 'Hug!',
	execute(message, args) {
		const { huggifs } = require('../config.json');
		const hug = huggifs[Math.floor(Math.random() * huggifs.length)];

		const tagged =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(r) =>
					r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()
			) ||
			message.guild.members.cache.find(
				(ro) =>
					ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()
			);

		const msgContent =
			tagged != undefined && tagged.id != message.author.id
				? `<@${message.author.id}> hugs <@${tagged.id}> tightly (´・ω・｀)`
				: `hugs back <@${message.author.id}> tightly (´・ω・｀)`;

		const embed = new MessageEmbed();
		embed.setColor('RANDOM');
		embed.setDescription(msgContent);
		embed.setImage(hug);
		message.channel.send(embed);
	},
	type: 3,
};
