import { MessageEmbed } from "discord.js";
import { getImage } from "../utils/api/apiStuff";
import { embedColor } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "slap",
	description: "Slap someone!",
	async execute(message, args) {
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

		if (user.id == message.author.id) {
			embed.setDescription("Please mention someone to slap!");
		} else {
			const slap = await getImage("/slap");
			embed.setDescription(`<@${message.author.id}> slaps <@${user.id}>.`);
			embed.setImage(slap.url);
			embed.setFooter(slap.api);
		}
		message.channel.send(embed);
	},
	type: 3,
} as Command;
