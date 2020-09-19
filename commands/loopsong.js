const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "loopsong",
	description: "loop current song",
	async execute(message) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (!message.member.voice.channel) {
			embed.setDescription(`You're not in a voice channel.`);
			return message.channel.send(embed);
		}

		if (!message.client.player.isPlaying(message.guild.id)) {
			embed.setDescription(`No music playing on this server ${emotes.error}`);
			return message.channel.send(embed);
		}

		const repeatMode = message.client.player.getQueue(message.guild.id)
			.repeatMode;

		if (repeatMode) {
			message.client.player.setRepeatMode(message.guild.id, false);

			embed.setDescription(`Repeat mode disabled ${emotes.success}`);
		} else {
			message.client.player.setRepeatMode(message.guild.id, true);

			embed.setDescription(`Repeat mode enabled ${emotes.success}`);
		}
		message.channel.send(embed);
	},
	type: 4,
	aliases: ["loop"],
};
