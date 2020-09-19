module.exports = {
	name: "skip",
	description: "skip",
	async execute(message) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to skip the music!"
			);
		if (!message.client.player.isPlaying(message.guild.id))
			return message.channel.send(
				`No music playing on this server ${emotes.error}`
			);

		message.client.player.skip(message.guild.id);
		message.react("⏭️");
	},
	type: 4,
};
