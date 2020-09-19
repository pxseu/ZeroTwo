module.exports = {
	name: "stop",
	description: "stop",
	async execute(message) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to stop the music!"
			);
		if (!message.client.player.isPlaying(message.guild.id))
			return message.channel.send(
				`No music playing on this server ${emotes.error}`
			);
		message.client.player.setRepeatMode(message.guild.id, false);
		message.client.player.stop(message.guild.id);

		message.react("🛑");
	},
	type: 4,
};
