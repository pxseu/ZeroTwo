import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";

module.exports = {
	name: "slap",
	description: "Slap someone!",
	async execute(message: Message, args: string[]) {
		const tagged =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(r) =>
					r.user.username.toLowerCase() ===
					args.join(" ").toLocaleLowerCase(),
			) ||
			message.guild.members.cache.find(
				(ro) =>
					ro.displayName.toLowerCase() ===
					args.join(" ").toLocaleLowerCase(),
			);

		const embed = new MessageEmbed();
		if (tagged == undefined || tagged.id == message.author.id) {
			embed.setDescription("Please mention someone to slap!");
		} else {
			const slap = await getImage("/slap");
			embed.setDescription(
				`<@${message.author.id}> slaps <@${tagged.id}>.`,
			);
			embed.setImage(slap.url);
		}
		embed.setColor("RANDOM");
		message.channel.send(embed);
	},
	type: 3,
};
