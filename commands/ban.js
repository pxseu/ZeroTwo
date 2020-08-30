const { bypassIds } = require("../utils/config");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "ban",
	description: "Ban a user!",
	async execute(message, args, guildConf) {
		if (!message.guild) return;

		if (
			message.member.roles.cache.some(
				(role) => role.name == guildConf.adminRole
			) ||
			message.member.roles.cache.some(
				(role) => role.name == guildConf.modRole
			) ||
			bypassIds.some((id) => id == message.author.id)
		) {
			let user =
				message.mentions.members.first() ||
				message.guild.members.cache.get(args[0]) ||
				message.guild.members.cache.find(
					(r) =>
						r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
				) ||
				message.guild.members.cache.find(
					(ro) =>
						ro.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
				);

			if (!user)
				return message.reply("Couldn' get a Discord user with this userID!");
			user = user.user;

			if (user === message.author)
				return message.channel.send("You can't ban yourself");
			if (!message.guild.member(user).bannable)
				return message.reply(
					"You can't ban this user because you the bot has not sufficient permissions!"
				);
			await message.guild.member(user).ban();
			message.react("☑️");
			if (guildConf.logging) {
				const embed = new MessageEmbed();
				embed.setColor("RANDOM");
				embed.setDescription(user.id + " has been banned!");
				message.guild.channels.cache.get(guildConf.logchannel).send(embed);
			}
		} else {
			message.reply("You don't have the permision to use this command.");
		}
	},
	type: 2,
};
