module.exports = {
	name: "skip",
	description: "skip",
	async execute(message) {
		if (!message.member.voice.channel) {
			message.error("You have to be in a voice channel to skip the music!");
			return;
		}
		if (!message.client.player.isPlaying(message)) {
			message.error(`No music playing on this server`);
			return;
		}

		message.client.player.setRepeatMode(message, false);
		message.client.player.skip(message);
		message.react("⏭️");
	},
	type: 4,
} as Command;
