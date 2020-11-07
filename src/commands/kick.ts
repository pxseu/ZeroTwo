import { Message } from "discord.js";
import { bypassIds } from "../utils/config";

module.exports = {
	name: "kick",
	description: "kick user",
	async execute(message: Message, args: string[], guildConf) {
		if (
			(bypassIds.some((id) => id == message.author.id) ||
				message.member.hasPermission("ADMINISTRATOR")) == false
		) {
			return message.reply(
				"You don't have the permision to use this command.",
			);
		}
		let user =
			message.mentions.members.first() ||
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
			return message.channel.send("You can't kick yourself");
		if (!message.guild.member(currentUser).bannable)
			return message.reply(
				"You can't kick this user because you the bot has not sufficient permissions!",
			);
		await message.mentions.members.first().kick();
		message.react("☑️");
	},
	type: 2,
};
