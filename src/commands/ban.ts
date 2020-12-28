import { bypassIds } from "../utils/config";

module.exports = {
	name: "ban",
	description: "Ban a user!",
	async execute(message, args) {
		if (
			Object.keys(bypassIds).some((id) => id == message.author.id) ||
			message.member.hasPermission("ADMINISTRATOR")
		) {
			const user =
				message.mentions.members?.first() ||
				message.guild.members.cache.get(args[0]) ||
				message.guild.members.cache.find(
					(r) => r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
				) ||
				message.guild.members.cache.find(
					(ro) => ro.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
				);

			if (!user) {
				message.reply("Couldn't get a Discord user with this userID!");
				return;
			}
			const currentUser = user.user;

			if (currentUser.id === message.author.id) {
				message.channel.send("You can't ban yourself");
				return;
			}
			if (!message.guild.member(currentUser).bannable) {
				message.reply(
					"You can't ban this user because you or the bot does not have sufficient permissions!"
				);
				return;
			}
			await message.guild.member(currentUser).ban();
			message.react("☑️");
		} else {
			message.reply("You don't have the permission to use this command.");
		}
	},
	type: 2,
} as Command;
