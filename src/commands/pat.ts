import { MessageEmbed } from "discord.js";
import { getImage } from "../utils/api/apiStuff";
import { embedColor } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "pat",
	description: "Pats!",
	async execute(message, args) {
		const pat = await getImage("/pat");

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
		const msgContent =
			user.id != message.author.id
				? `<@${message.author.id}> pats <@${user.id}> with lots of love.`
				: `Pats with love have been sent to <@${message.author.id}>.`;

		embed.setDescription(msgContent);
		embed.setImage(pat.url);
		embed.setFooter(pat.api);
		message.channel.send(embed);
	},
	type: 5,
} as Command;
