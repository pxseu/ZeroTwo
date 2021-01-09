import { Activity } from "discord.js";
import { MessageEmbed } from "discord.js";
import { embedColor } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";

interface syncId extends Activity {
	syncID: string;
}

module.exports = {
	name: "status",
	description: "Shows status of users",
	async execute(message, args) {
		let user = message.member.user;

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (uFetch == undefined) {
				message.error("User not found!");
				return;
			}
			user = uFetch;
		}

		if (!user.presence.activities.length) {
			message.error({
				title: "**No Status**",
				text: "This user does not have any custom status!",
			});
			return;
		}

		user.presence.activities.forEach((activity) => {
			if (activity.type === "CUSTOM_STATUS") {
				const embed = new MessageEmbed();
				embed.setAuthor(user.username, user.displayAvatarURL({ dynamic: true }));
				embed.setColor(embedColor);
				embed.addField(
					"**Status**",
					`**Custom status** -\n${activity.emoji || "No Emoji"} | ${activity.state}`
				);
				embed.setThumbnail(user.displayAvatarURL());
				embed.setFooter(message.guild.name, message.guild.iconURL());
				embed.setTimestamp();
				message.channel.send(embed);
			} else if (activity.type === "PLAYING") {
				const name1 = activity.name;
				const details1 = activity.details;
				const state1 = activity.state;
				const image = user.displayAvatarURL({ dynamic: true });

				const sembed = new MessageEmbed();
				sembed.setAuthor(`${user.username}'s Activity`);
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
				const trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
				const trackURL = `https://open.spotify.com/track/${(activity as syncId).syncID}`;

				const trackName = activity.details;
				let trackAuthor = activity.state;
				const trackAlbum = activity.assets.largeText;

				trackAuthor = trackAuthor.replace(/;/g, ",");

				const embed = new MessageEmbed();
				embed.setAuthor(
					"Spotify Track Info",
					"https://cdn.discordapp.com/emojis/408668371039682560.png"
				);
				embed.setColor(embedColor);
				embed.setThumbnail(trackIMG);
				embed.addField("Song Name", trackName, true);
				embed.addField("Album", trackAlbum, true);
				embed.addField("Author", trackAuthor, false);
				embed.addField("Listen to Track", `${trackURL}`, false);
				embed.setFooter(user.username, user.displayAvatarURL({ dynamic: true }));
				message.channel.send(embed);
			}
		});
	},
	type: 1,
	cooldown: 5,
} as Command;
