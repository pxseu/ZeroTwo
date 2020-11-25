import { bypassIds } from "../utils/config";
import { MessageEmbed, Message } from "discord.js";

module.exports = {
	name: "ban",
	description: "Ban a user!",
	async execute(message: Message, args: string[]) {
		if (
			Object.keys(bypassIds).some((id) => id == message.author.id) ||
			message.member.hasPermission("ADMINISTRATOR")
		) {
			let user =
				message.mentions.members?.first() ||
				message.guild.members.cache.get(args[0]) ||
				message.guild.members.cache.find(
					(r) =>
						r.user.username.toLowerCase() ===
						args.join(" ").toLocaleLowerCase(),
				) ||
				message.guild.members.cache.find(
					(ro) =>
						ro.displayName.toLowerCase() ===
						args.join(" ").toLocaleLowerCase(),
				);

			if (!user)
				return message.reply(
					"Couldn' get a Discord user with this userID!",
				);
			const currentUser = user.user;

			if (currentUser.id === message.author.id)
				return message.channel.send("You can't ban yourself");
			if (!message.guild.member(currentUser).bannable)
				return message.reply(
					"You can't ban this user because you the bot has not sufficient permissions!",
				);
			await message.guild.member(currentUser).ban();
			message.react("☑️");
		} else {
			message.reply("You don't have the permision to use this command.");
		}
	},
	type: 2,
};
