const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "songprogress",
	description: "get song progress",
	async execute(message) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (!message.member.voice.channel) {
			embed.setDescription(`You're not in a voice channel ${emotes.error}`);
			return message.channel.send(embed);
		}

		//If there's no music
		if (!message.client.player.isPlaying(message.guild.id)) {
			embed.setDescription(`No music playing on this server ${emotes.error}`);
			return message.channel.send(embed);
		}

		const song = await message.client.player.nowPlaying(message.guild.id);

		//Message
		embed.setDescription(
			`Currently playing \`${
				song.name
			}\`\nProgress: [${message.client.player.createProgressBar(
				message.guild.id
			)}]`
		);
		message.channel.send(embed);
	},
	type: 4,
	aliases: ["progress"],
};
