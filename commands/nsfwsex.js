const { MessageEmbed } = require('discord.js');
const getImage = require('../utils/getImage');

module.exports = {
	name: 'sex',
	description: 'Sex someone!',
	async execute(message, args) {
		const goodEndPoints = ['/classic', '/Random_hentai_gif'];
		const sex = await getImage(
			goodEndPoints[Math.floor(Math.random() * goodEndPoints.length)]
		);

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
				? `<@${message.author.id}> fucks <@${tagged.id}> hard 😳`
				: `Hot sex scene 😳`;

		const embed = new MessageEmbed();
		embed.setColor('RANDOM');
		embed.setDescription(msgContent);
		embed.setImage(sex.url);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ['fuck'],
};
