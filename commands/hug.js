const { MessageEmbed } = require('discord.js');
const getImage = require('../utils/getImage');
//const { huggifs } = require('../utils/config');

module.exports = {
	name: 'hug',
	description: 'Hug!',
	async execute(message, args) {
		const goodEndPoints = ['/hug', '/cuddle'];
		const hug = await getImage(
			goodEndPoints[Math.floor(Math.random() * goodEndPoints.length)]
		);
		//const hug = huggifs[Math.floor(Math.random() * huggifs.length)];

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
		embed.setImage(hug.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ['cuddle', 'cuddleing', 'furhug', 'tuli', 'tulimy'],
};
