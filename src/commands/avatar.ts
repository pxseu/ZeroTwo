import { MessageEmbed } from "discord.js";
import { bannedIds } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "avatar",
	description: "Show users avatar!",
	async execute(message, args) {
		let user = message.member?.user;

		let cute = true;

		if (args.find((arg) => arg.toLowerCase() == "--notcute")) {
			cute = false;
			args = args.filter((arg) => arg.toLowerCase() != "--notcute");
		}

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (!uFetch) {
				message.info("User was not found!");
				return;
			}
			user = uFetch;
		}

		if (bannedIds.find((id) => id == user.id)) cute = false;

		const avatarUrl = `${user.displayAvatarURL({
			dynamic: true,
		})}?size=4096`;

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(`${user.id == message.author.id ? "Your" : user.username} avatar.`);
		embed.setImage(avatarUrl);
		embed.setFooter(cute ? "u wook cute <33" : "u don wook cute...", avatarUrl);
		message.channel.send(embed);
	},
	type: 1,
	aliases: ["pfp", "icon", "av"],
} as Command;
