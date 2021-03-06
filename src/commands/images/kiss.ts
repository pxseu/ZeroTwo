import { MessageEmbed } from "discord.js";
import { getImage } from "../../utils/api/apiStuff";
import { embedColor } from "../../utils/config";
import { fetchUser } from "../../utils/fetchUser";

module.exports = {
	name: "kiss",
	description: "Kiss!",
	async execute(message, args) {
		const kiss = await getImage("/kiss");

		let user = message.member.user;

		const embed = new MessageEmbed();
		embed.setColor(embedColor);

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

		const msgContent =
			user.id != message.author.id
				? `<@${message.author.id}> kisses <@${user.id}> (vewy uwu)`
				: `kisses <@${message.author.id}> uwu`;

		embed.setDescription(msgContent);
		embed.setImage(kiss.url);
		embed.setFooter(kiss.api);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["makeout", "kims", "buzi"],
} as Command;
