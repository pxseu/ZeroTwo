import { MessageEmbed, User } from "discord.js";
import { bypassIds, warnGifs, warnDesc, embedColorError } from "../../utils/config";
import { fetchMember, fetchUser } from "../../utils/fetchUser";

module.exports = {
	name: "warn",
	description: "Warn a person",
	async execute(message, args) {
		const isBypass = Object.keys(bypassIds).some((id) => id == message.author.id);
		if (!isBypass && !message.member.hasPermission("ADMINISTRATOR")) {
			message.error("You don't have the permission to use this command.");
			return;
		}

		let retardMode = false;

		if (args.find((argument) => argument.toLowerCase() == "--retard")) {
			args = args.filter((argument) => argument != "--retard");
			retardMode = true;
		}

		if (args.length < 1) {
			message.info("Provide a user to warn!");
			return;
		}

		const user = isBypass ? await fetchUser(message, args) : (await fetchMember(message, args)).user;

		if (!user) {
			message.info("User was not found!");
			return;
		}

		try {
			await warnUser(user, retardMode, message.guild.id, message.author);

			message.info(retardMode ? "Stoopid user is warning!!!!!!10!" : "User has been warned.");
		} catch (e) {
			message.error("Failed to send the warning!");
		}
	},
	type: 3,
	cooldown: 10,
} as Command;

async function warnUser(user: User, retardMode: boolean, guildId: string, author: User): Promise<void> {
	const embed = new MessageEmbed();

	embed.setTitle("Warning");
	embed.setColor(embedColorError);
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
