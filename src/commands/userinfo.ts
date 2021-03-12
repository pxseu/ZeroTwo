import { MessageEmbed } from "discord.js";
import moment from "moment";
import { bypassIds, embedColor, embedColorStaff } from "../utils/config";
import { fetchMember, fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "userinfo",
	description: "Tells you something about the user.",
	async execute(message, args) {
		let user = message.member.user;

		if (args.length > 0) {
			try {
				const uFetch = await fetchUser(message, args);
				if (uFetch === undefined) {
					throw new Error("le bruh");
				}
				user = uFetch;
			} catch (_) {
				return message.error("User was not found!");
			}
		}

		const member = await fetchMember(message, args);

		const roles = member ? member.roles.cache.map((r) => `${r}`).join(" | ") : null;

		const avatarUrl = `${user.displayAvatarURL({
			dynamic: true,
		})}?size=4096`;

		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setAuthor(member?.displayName ? member.displayName : user.username, avatarUrl);
		embed.addField("Full Tag", user.tag, true);
		embed.addField("Avatar Url", `[Current Avatar Url](${avatarUrl})`, true);
		embed.addField("Bot", user.bot ? "Yes" : "No", true);
		embed.addField(
			"Joined",
			member
				? moment.unix(member.joinedAt.getTime() / 1000).format("DD/MM/YYYY HH:mm:ss")
				: "User is not in the guild!",
			true
		);
		embed.addField("Registered", moment.unix(user.createdAt.getTime() / 1000).format("DD/MM/YYYY HH:mm:ss"), true);

		if (Object.keys(bypassIds).some((id) => id == user.id)) {
			embed.addField("Special user", `Status: ${bypassIds[user.id]}`, true);
			embed.setColor(embedColorStaff);
		}

		embed.addField(
			`Roles:`,
			member ? (roles.length > 1024 ? `Too many roles to show.` : roles) : "User is not in the guild!",
			false
		);
		embed.setTimestamp(Date.now());

		message.channel.send(embed);
	},
	type: 1,
	cooldown: 5,
	aliases: ["whois", "user"],
} as Command;
