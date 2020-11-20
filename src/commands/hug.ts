import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../utils/apiStuff";

module.exports = {
	name: "hug",
	description: "Hug!",
	async execute(message: Message, args: string[]) {
		const hug = await getImage("/hug");

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

		const msgContent =
			tagged != undefined && tagged.id != message.author.id
				? `<@${message.author.id}> hugs <@${tagged.id}> tightly (´・ω・｀)`
				: `hugs back <@${message.author.id}> tightly (´・ω・｀)`;

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(msgContent);
		embed.setImage(hug.url);
		embed.setFooter(hug.api);
		message.channel.send(embed);
	},
	type: 6,
	aliases: ["cuddle", "cuddleing", "furhug", "tuli", "tulimy"],
};
