const { MessageEmbed } = require('discord.js');
const getImage = require('../utils/getImage');
//const { patgifs } = require('../utils/config');

module.exports = {
	name: 'pat',
	description: 'Pats!',
	async execute(message, args) {
		const pat = await getImage('/pat');
		//const pat = patgifs[Math.floor(Math.random() * patgifs.length)];

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
				? `<@${message.author.id}> pats <@${tagged.id}> with lots of love.`
				: `Pats with love have been sent to <@${message.author.id}>.`;

		const embed = new MessageEmbed();
		embed.setColor('RANDOM');
		embed.setDescription(msgContent);
		embed.setImage(pat.url);
		message.channel.send(embed);
	},
	type: 6,
};
