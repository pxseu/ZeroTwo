import { Message, MessageEmbed } from "discord.js";
import api from "genius-api";
import { embedColor, embedColorError } from "../utils/config";
import { fetchUser } from "../utils/fetchUser";
const genius = new api(process.env.GENIUS_TOKEN);

module.exports = {
	name: "lyricsspotify",
	description: "Show lyrics to the spotufy song you're listening.",
	async execute(message: Message, args: string[]) {
		let user = message.member.user;

		const embed = new MessageEmbed();

		if (args.length > 0) {
			const uFetch = await fetchUser(message, args);
			if (uFetch == undefined) {
				embed.setColor(embedColorError);
				embed.setDescription("User not found!");
				message.channel.send(embed);
				return;
			}
			user = uFetch;
		}

		if (!user.presence.activities.length) {
			embed.setAuthor(
				user.username,
				user.displayAvatarURL({ dynamic: true }),
			);
			embed.setColor("GREEN");
			embed.setThumbnail(user.displayAvatarURL());
			embed.addField(
				"**No song playing on spotify!**",
				"You or this user is not playing any song!",
			);
			embed.setFooter(message.guild.name, message.guild.iconURL());
			embed.setTimestamp();
			message.channel.send(embed);
			return;
		}
		user.presence.activities.forEach((activity) => {
			if (
				activity.type === "LISTENING" &&
				activity.name === "Spotify" &&
				activity.assets !== null
			) {
				let trackName = activity.details;
				let trackAuthor = activity.state;
				trackAuthor = trackAuthor.replace(/;/g, " ");

				genius
					.search(`${trackName} by ${trackAuthor}`)
					.then((response) => {
						let descriptionFunsies = "";
						if (
							response.hits == undefined ||
							response.hits.length === 0
						) {
							descriptionFunsies = "No song found!";
						} else {
							console.log(response.hits);
							let loopCount = 0;
							for (const result of response.hits) {
								if (loopCount == 5) break;
								loopCount++;
								descriptionFunsies += `**[${result.result.full_title}](${result.result.url})**`;
								descriptionFunsies += "\n\n";
							}
						}

						embed.setAuthor(
							user.username,
							user.displayAvatarURL({ dynamic: true }),
						);
						embed.setColor(embedColor);
						embed.setThumbnail(user.displayAvatarURL());
						embed.setTitle("**Results:**");
						embed.setDescription(descriptionFunsies);
						embed.setFooter(
							message.guild.name,
							message.guild.iconURL(),
						);
						embed.setTimestamp();
						return message.channel.send(embed);
					});
			}
		});

		embed.setAuthor(
			user.username,
			user.displayAvatarURL({ dynamic: true }),
		);
		embed.setColor("GREEN");
		embed.setThumbnail(user.displayAvatarURL());
		embed.addField(
			"**No song playing on spotify!**",
			"You or this user is not playing any song!",
		);
		embed.setFooter(message.guild.name, message.guild.iconURL());
		embed.setTimestamp();
		message.channel.send(embed);
	},
	type: 4,
	cooldown: 5,
} as Command;
