import { bypassIds } from "../utils/config";

module.exports = {
	name: "kick",
	description: "kick user",
	async execute(message, args) {
		if (
			(Object.keys(bypassIds).some((id) => id == message.author.id) ||
				message.member.hasPermission("ADMINISTRATOR")) == false
		) {
			message.reply("You don't have the permission to use this command.");
			return;
		}
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(r) => r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
			) ||
			message.guild.members.cache.find(
				(ro) => ro.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
			);

		if (!member) {
			message.reply("Couldn't get a Discord user with this userID!");
			return;
		}

		if (member.id === message.author.id) {
			message.channel.send("You can't kick yourself");
			return;
		}
		if (!member.bannable) {
			message.reply(
				"You can't kick this user because you or the bot does not have sufficient permissions!"
			);
			return;
		}
		await member.kick();
		message.react("☑️");
	},
	type: 2,
} as Command;
