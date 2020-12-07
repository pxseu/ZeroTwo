import { MessageEmbed, Message } from "discord.js";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "avatar",
	description: "Show users avatar!",
	async execute(message: Message, args: string[]) {
		let user = message.member.user;

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (uFetch == undefined) {
				embed.setDescription("User not found!");
				message.channel.send(embed);
				return;
			}
			user = uFetch;
		}

		const avatarUrl = `${user.displayAvatarURL({
			dynamic: true,
		})}?size=4096`;

		embed.setDescription(
			`${user.id == message.author.id ? "Your" : user.username} avatar`,
		);
		embed.setImage(avatarUrl);
		embed.setFooter(`u wook cute <33`, avatarUrl);
		message.channel.send(embed);
	},
	type: 1,
	aliases: ["pfp", "icon"],
} as Command;
