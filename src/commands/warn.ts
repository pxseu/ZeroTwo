import { MessageEmbed, User } from "discord.js";
import { bypassIds, embedColor, embedColorError, embedColorInfo, warnGifs } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

module.exports = {
	name: "warn",
	description: "Warn a person",
	async execute(message, args) {
		if (
			!Object.keys(bypassIds).some((id) => id == message.author.id) &&
			!message.member.hasPermission("ADMINISTRATOR")
		) {
			message.reply("You don't have the permission to use this command.");
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
		embed.setDescription(`Q. Have any friends 
        A. Yes 
        Q. What's your gender 
        A. Male 
        Q. Favorite hobbies besides games 
        A. Guitar 
        Q. What happens if your offline 
        A. Internet connection 
        If you want to add me on steam comment below and have a really good reson or I will DECLINE and I DON'T ACCPET PRIVET PROFILES but IDC if you have a or multipule VAC bans as long I see your profile then I will accpet.
        Online: feel free to talk to me or invite me to a game that I have 
        Away: at school or guitar lessons 
        Busy: cant do Jackshit right now or eating dinner 
        Looking to play: just invite me to a game what ever I'm doing
        Looking to trade: you'er welcome to trade me 
        Offline: Dont have internet or parentes are yelling 
        at me 
        In game: don't bother talking to me or inviting me to a game 
        and if I dont find respect in the comment secion YOU WILL BE BLOCKED and if you disrespect in my group after you join me or the other admins but if you post something funny and everyone smiles at it then you can stay in I also have a discord server so if you want to join you can same rules but one rule in my discord DON'T SPAM MEMES and Porno`);
		embed.setImage(warnGifs[Math.floor(warnGifs.length * Math.random())]);
	} else {
		embed.setDescription(`You have been warned by <@${author.id}>.`);
	}

	embed.setFooter(`Server: ${guildId}`);
	embed.setTimestamp();
	await user.send(embed);
}
