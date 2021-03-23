import { MessageEmbed } from "discord.js";
import { getImage } from "../../utils/api/apiStuff";
import { embedColor } from "../../utils/config";
import { fetchUser } from "../../utils/fetchUser";

module.exports = {
	name: "hug",
	description: "Hug!",
	async execute(message, args) {
		const hug = await getImage("/hug");

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
				? `<@${message.author.id}> hugs <@${user.id}> tightly (´・ω・｀)`
				: `hugs back <@${message.author.id}> tightly (´・ω・｀)`;

		embed.setDescription(msgContent);
		embed.setImage(hug.url);
		embed.setFooter(hug.api);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["cuddle", "cuddleing", "furhug", "tuli", "tulimy"],
} as Command;
