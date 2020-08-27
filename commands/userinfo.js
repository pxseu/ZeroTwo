const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'userinfo',
	description: 'Tells you something about the user.',
	execute(message, args) {
		let member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(r) =>
					r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()
			) ||
			message.guild.members.cache.find(
				(ro) =>
					ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()
			) ||
			message.member;

		if (!member)
			return message.channel.send(`Couldn't find user ${args.join(' ')}`);

		const roles = member.roles.cache.map((r) => `${r}`).join(' | ');

		const embed = new MessageEmbed();
		embed.setAuthor(
			member.displayName ? member.displayName : member.user.username,
			member.user.displayAvatarURL({ dynamic: true })
		);
		embed.addField(
			'Joined',
			moment.unix(member.joinedAt / 1000).format('llll'),
			true
		);
		embed.addField(
			'Registered',
			moment.unix(member.user.createdAt / 1000).format('llll'),
			true
		);
		embed.addField(
			`Roles:`,
			roles.length > 1024 ? `Too many roles to show.` : roles,
			false
		);
		embed.setTimestamp(Date.now());

		message.channel.send(embed);
	},
	type: 1,
};
