import { MessageEmbed, User } from "discord.js";
import {
	bypassIds,
	embedColor,
	embedColorError,
	embedColorInfo,
	warnGifs,
	warnDesc,
} from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "warn",
	description: "Warn a person",
	async execute(message, args) {
		if (
			!Object.keys(bypassIds).some((id) => id == message.author.id) &&
			!message.member.hasPermission("ADMINISTRATOR")
		) {
			message.error("You don't have the permission to use this command.");
			return;
		}

		let retardMode = false;
		let user = message.member.user;

		const embed = new MessageEmbed();
		embed.setColor(embedColor);

		if (args.find((argument) => argument.toLowerCase() == "--retard")) {
			args = args.filter((argument) => argument != "--retard");
			retardMode = true;
		}

		if (args.length < 1) {
			embed.setDescription("Provide a user to warn!");
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (uFetch == undefined) {
				embed.setDescription("User not found!");
				message.channel.send(embed);
				return;
			}
			user = uFetch;
		}

		const userInServer = message.guild.members.cache.get(user.id);

		if (!userInServer) {
			embed.setDescription("User was not found.");
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}

		await warnUser(user, retardMode, message.guild.id, message.member.user);

		embed.setDescription(
			retardMode ? "Stoopid user is warning!!!!!!11!" : "User has been warned."
		);
		message.channel.send(embed);
	},
	type: 3,
	cooldown: 10,
} as Command;

async function warnUser(
	user: User,
	retardMode: boolean,
	guildId: string,
	author: User
): Promise<void> {
	const embed = new MessageEmbed();
	embed.setTitle("Warning");
	embed.setColor(embedColorInfo);
	embed.setThumbnail(user.displayAvatarURL({ dynamic: true }));
	embed.setAuthor(author.username, author.displayAvatarURL({ dynamic: true }));

	if (retardMode) {
		embed.setDescription(warnDesc[Math.floor(warnDesc.length * Math.random())]);
		embed.setImage(warnGifs[Math.floor(warnGifs.length * Math.random())]);
	} else {
		embed.setDescription(`You have been warned by <@${author.id}>.`);
	}

	embed.setFooter(`Server: ${guildId}`);
	embed.setTimestamp();
	await user.send(embed);
}
