const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "skip",
	description: "skip",
	async execute(message) {
		if (!message.member.voice.channel) {
			const embed = new MessageEmbed();
			embed.setColor("RANDOM");
			embed.setDescription(
				"You have to be in a voice channel to skip the music!"
			);
			return message.channel.send(embed);
		}
		if (!message.client.player.isPlaying(message.guild.id)) {
			const embed = new MessageEmbed();
			embed.setColor("RANDOM");
			embed.setDescription(`No music playing on this server`);
			return message.channel.send(embed);
		}

		message.client.player.skip(message.guild.id);
		message.react("⏭️");
	},
	type: 4,
};
