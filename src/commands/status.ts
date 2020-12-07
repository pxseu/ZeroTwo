import { Message, MessageEmbed } from "discord.js";
import { embedColor, embedColorInfo } from "../utils/config";

module.exports = {
	name: "status",
	description: "Shows status of users",
	async execute(message: Message, args: string[]) {
		let user =
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
			) ||
			message.member;

		if (!user.presence.activities.length) {
			const sembed = new MessageEmbed();
			sembed.setAuthor(
				user.user.username,
				user.user.displayAvatarURL({ dynamic: true }),
			);
			sembed.setColor(embedColorInfo);
			sembed.setThumbnail(user.user.displayAvatarURL());
			sembed.addField(
				"**No Status**",
				"This user does not have any custom status!",
			);
			sembed.setFooter(message.guild.name, message.guild.iconURL());
			sembed.setTimestamp();
			message.channel.send(sembed);
			return undefined;
		}

		user.presence.activities.forEach((activity) => {
			if (activity.type === "CUSTOM_STATUS") {
				const embed = new MessageEmbed();
				embed.setAuthor(
					user.user.username,
					user.user.displayAvatarURL({ dynamic: true }),
				);
				embed.setColor(embedColor);
				embed.addField(
					"**Status**",
					`**Custom status** -\n${activity.emoji || "No Emoji"} | ${
						activity.state
					}`,
				);
				embed.setThumbnail(user.user.displayAvatarURL());
				embed.setFooter(message.guild.name, message.guild.iconURL());
				embed.setTimestamp();
				message.channel.send(embed);
			} else if (activity.type === "PLAYING") {
				let name1 = activity.name;
				let details1 = activity.details;
				let state1 = activity.state;
				let image = user.user.displayAvatarURL({ dynamic: true });

				const sembed = new MessageEmbed();
				sembed.setAuthor(`${user.user.username}'s Activity`);
				sembed.setColor(embedColor);
				sembed.setThumbnail(image);
				sembed.addField("**Type**", "Playing");
				sembed.addField("**App**", `${name1}`);
				sembed.addField("**Details**", `${details1 || "No Details"}`);
				sembed.addField("**Working on**", `${state1 || "No Details"}`);
				message.channel.send(sembed);
			} else if (
				activity.type === "LISTENING" &&
				activity.name === "Spotify" &&
				activity.assets !== null
			) {
				let trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(
					8,
				)}`;
				//@ts-ignore
				let trackURL = `https://open.spotify.com/track/${activity.syncID}`;

				let trackName = activity.details;
				let trackAuthor = activity.state;
				let trackAlbum = activity.assets.largeText;

				trackAuthor = trackAuthor.replace(/;/g, ",");

				const embed = new MessageEmbed();
				embed.setAuthor(
					"Spotify Track Info",
					"https://cdn.discordapp.com/emojis/408668371039682560.png",
				);
				embed.setColor(embedColor);
				embed.setThumbnail(trackIMG);
				embed.addField("Song Name", trackName, true);
				embed.addField("Album", trackAlbum, true);
				embed.addField("Author", trackAuthor, false);
				embed.addField("Listen to Track", `${trackURL}`, false);
				embed.setFooter(
					user.displayName,
					user.user.displayAvatarURL({ dynamic: true }),
				);
				message.channel.send(embed);
			}
		});
	},
	type: 1,
	cooldown: 5,
} as Command;
