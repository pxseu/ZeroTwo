import { Message } from "discord.js";
import { bypassIds } from "../utils/config";

module.exports = {
	name: "assign",
	description: "Assign a role (only for mods etc)!",
	execute(message: Message, args: string[], guildConf: { prefix: string }) {
		if (args.length < 1)
			return message.channel.send({
				embed: {
					title: "Assign a role.",
					description: `\`\`You can assign the roles by ${guildConf.prefix}assign [roleName]\`\``,
				},
			});

		const mentioned = message.mentions.members.first();
		let userToAddRole = message.member;

		if (mentioned != undefined) {
			if (args[0].startsWith("<@") && args[0].endsWith(">")) {
				args.shift();
				userToAddRole = mentioned;
			}
		}

		if (
			message.member.hasPermission("ADMINISTRATOR") ||
			bypassIds.some((id) => id == message.author.id)
		) {
			const query = args.join(" ");

			const role = message.guild.roles.cache.find((r) => r.name == query);

			if (!role) return message.channel.send("Role doesen't exist.");

			if (userToAddRole.roles.cache.find((r) => r.name == role.name)) {
				message.channel.send("User aleady has the role.");
				message.react("❌");
			} else {
				userToAddRole.roles.add(role.id);
				message.react("✔");
				message.channel.send("Added role to user.");
			}
		} else {
			message.channel.send("Insufficient permissions.");
		}
	},
	type: 2,
};
