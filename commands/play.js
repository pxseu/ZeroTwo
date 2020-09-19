const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "play",
	description: "Play song!",
	async execute(message, args, guildConf, serverQueue, queue) {
		if (!message.member.voice.channel)
			return message.channel.send(`You're not in a voice channel.`);

		if (!args[0]) return message.channel.send(`Please specify a song to play.`);

		const currentTrack = message.client.player.isPlaying(message.guild.id);

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (currentTrack) {
			const result = await message.client.player
				.addToQueue(message.guild.id, args.join(" "))
				.catch(() => {});
			if (!result) {
				message.member.voice.channel.leave();

				embed.setDescription(
					`This song provider is not supported. \[<@${message.member.id}>\]`
				);

				return message.channel.send(embed);
			}

			if (result.type === "playlist") {
				embed.setDescription(
					`${result.tracks.length} songs added to the queue \[<@${message.member.id}>\]`
				);
			} else {
				embed.setDescription(
					`${result.name} added to the queue \[<@${message.member.id}>\]`
				);
			}

			message.channel.send(embed);
		} else {
			//Else, play the song
			const result = await message.client.player
				.play(message.member.voice.channel, args.join(" "))
				.catch(() => {});
			if (!result) {
				message.member.voice.channel.leave();
				embed.setDescription(
					`This song provider is not supported. \[<@${message.member.id}>\]`
				);

				return message.channel.send(embed);
			}

			if (result.type === "playlist") {
				embed.setDescription(
					`${result.tracks.length} songs added to the queue \[<@${message.member.id}>\]\nCurrently playing ${result.tracks[0].name}`
				);
			} else {
				embed.setDescription(
					`Currently playing ${result.name} \[<@${message.member.id}>\]`
				);
			}
			message.channel.send(embed);

			const queue = message.client.player.getQueue(message.guild.id);

			queue.on("end", () => {
				embed.setDescription(
					`There is no more music in the queue ${emotes.error}`
				);
				message.channel.send(embed);
			});
			queue.on("trackChanged", (_, newTrack) => {
				embed.setDescription(
					`Now playing ${newTrack.name} ... ${emotes.music}`
				);
				message.channel.send(embed);
			});
			queue.on("channelEmpty", () => {
				embed.setDescription(
					`Music stopped, there are no more members in the voice channel ${emotes.error}`
				);
				message.channel.send(embed);
			});
		}
	},
	type: 4,
	aliases: ["p"],
};
