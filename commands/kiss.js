const { MessageEmbed } = require('discord.js');
const getImage = require('../utils/getImage');
//const { kissgifs } = require('../utils/config');

module.exports = {
	name: 'kiss',
	description: 'Kiss!',
	async execute(message, args) {
		const kiss = await getImage('/kiss');
		//const kiss = kissgifs[Math.floor(Math.random() * kissgifs.length)];

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
				? `<@${message.author.id}> kisses <@${tagged.id}> (vewy uwu)`
				: `kisses <@${message.author.id}> uwu`;

		const embed = new MessageEmbed();
		embed.setColor('RANDOM');
		embed.setDescription(msgContent);
		embed.setImage(kiss.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ['makeout', 'kims', 'buzi'],
};
