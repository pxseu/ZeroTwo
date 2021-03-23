import { bypassIds } from "../../utils/config";
import { fetchMember } from "../../utils/fetchUser";

module.exports = {
	name: "kick",
	description: "kick user",
	async execute(message, args) {
		if (
			!(
				Object.keys(bypassIds).some((id) => id == message.author.id) ||
				message.member.hasPermission("KICK_MEMBERS")
			)
		) {
			message.info("You don't have the permission to use this command.");
			return;
		}

		const memberFetch = await fetchMember(message, args);

		if (!memberFetch) {
			message.info("User was not found!");
			return;
		}

		if (memberFetch.id === message.author.id) {
			message.info("You can't kick yourself");
			return;
		}

		try {
			await memberFetch.ban();
			message.react("☑");
		} catch (e) {
			message.error("You can't kick this user because the bot does not have sufficient permissions!");
		}
	},
	type: 2,
} as Command;
