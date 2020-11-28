import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";
import { embedColor } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "slap",
	description: "Slap someone!",
	async execute(message: Message, args: string[]) {
		let user = message.member.user;
		const embed = new MessageEmbed();
		embed.setColor(embedColor);

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (uFetch == undefined) {
				embed.setDescription("User not found!");
				message.channel.send(embed);
				return;
			}
			user = uFetch;
		}

		if (user.id == message.author.id || message.author.id != 634774973201907714) {
			embed.setDescription("Please mention someone to slap!");
		} else {
			const slap = await getImage("/slap");
			embed.setDescription(
				`<@${message.author.id}> slaps <@${user.id}>.`,
			);
			embed.setImage(slap.url);
			embed.setFooter(slap.api);
		}
		message.channel.send(embed);
	},
	type: 3,
};
