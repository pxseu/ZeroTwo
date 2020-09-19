module.exports = {
	name: "loopsong",
	description: "loop current song",
	async execute(message, args, guildConf, serverQueue, queue, client, Server) {
		if (!message.member.voice.channel)
			return message.channel.send(
				`You're not in a voice channel ${emotes.error}`
			);

		if (!client.player.isPlaying(message.guild.id))
			return message.channel.send(
				`No music playing on this server ${emotes.error}`
			);

		//Repeat mode
		const repeatMode = client.player.getQueue(message.guild.id).repeatMode;

		//If the mode is enabled
		if (repeatMode) {
			client.player.setRepeatMode(message.guild.id, false);

			//Message
			return message.channel.send(`Repeat mode disabled ${emotes.success}`);

			//If the mode is disabled
		} else {
			client.player.setRepeatMode(message.guild.id, true);

			//Message
			return message.channel.send(`Repeat mode enabled ${emotes.success}`);
		}
	},
	type: 4,
	aliases: ["loop"],
};
