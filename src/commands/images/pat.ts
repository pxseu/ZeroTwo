import { MessageEmbed } from "discord.js";
import { getImage } from "../../utils/api/apiStuff";
import { embedColor } from "../../utils/config";
import { fetchUser } from "../../utils/fetchUser";

module.exports = {
	name: "pat",
	description: "Pats!",
	async execute(message, args) {
		const pat = await getImage("/pat");

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

		const msgContent =
			user.id != message.author.id
				? `<@${message.author.id}> pats <@${user.id}> with lots of love.`
				: `Pats with love have been sent to <@${message.author.id}>.`;

		const embed = new MessageEmbed();
		embed.setColor(embedColor);
		embed.setDescription(msgContent);
		embed.setImage(pat.url);
		embed.setFooter(pat.api);
		message.channel.send(embed);
	},
	type: 5,
} as Command;
