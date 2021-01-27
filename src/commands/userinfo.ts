import { MessageEmbed } from "discord.js";
import moment from "moment";
import { bypassIds, embedColor, embedColorStaff } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "userinfo",
	description: "Tells you something about the user.",
	async execute(message, args) {
		let user = message.member.user;
		const embed = new MessageEmbed();
		embed.setColor(embedColor);

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (uFetch == undefined) {
				embed.setDescription("User was not found!");
				message.channel.send(embed);
				return;
			}
			user = uFetch;
		}

		const regexMention = args.join(" ").match(/<@!?(\d{18})>/gi);

		const member =
			user.id == message.author.id
				? message.member
				: message.guild.members.cache.get(regexMention ? regexMention[0]?.match(/\d+/gim)[0] : undefined) ||
				  message.guild.members.cache.get(args[0]) ||
				  message.guild.members.cache.find(
						(r) => r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
				  ) ||
				  message.guild.members.cache.find(
						(ro) => ro.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
				  );

		const roles = member ? member.roles.cache.map((r) => `${r}`).join(" | ") : null;

		const avatarUrl = `${user.displayAvatarURL({
			dynamic: true,
		})}?size=4096`;

		embed.setAuthor(member?.displayName ? member.displayName : user.username, avatarUrl);
		embed.addField("Full Tag", user.tag, true);
		embed.addField("Avatar Url", `[Current Avatar Url](${avatarUrl})`, true);
		embed.addField("Bot", user.bot ? "Yes" : "No", true);
		embed.addField("** **", "** **");
		embed.addField(
			"Joined",
			member
				? moment.unix(member.joinedAt.getTime() / 1000).format("DD/MM/YYYY HH:mm:ss")
				: "User is not in the guild!",
			true
		);
		embed.addField("Registered", moment.unix(user.createdAt.getTime() / 1000).format("DD/MM/YYYY HH:mm:ss"), true);

		if (Object.keys(bypassIds).some((id) => id == user.id)) {
			embed.addField("** **", "** **");
			embed.addField("Special user", `Status: ${bypassIds[user.id]}`);
			embed.setColor(embedColorStaff);
		}

		embed.addField("** **", "** **");
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
	aliases: ["whois"],
} as Command;
