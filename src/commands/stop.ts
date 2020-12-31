module.exports = {
	name: "stop",
	description: "stop",
	execute(message) {
		if (!message.member.voice.channel) {
			message.error("You have to be in a voice channel to stop the music!");
			return;
		}
		if (!message.client.player.isPlaying(message)) {
			message.error(`No music playing on this server.`);
			return;
		}

		//@ts-expect-error the types are wrong
		message.client.player.setRepeatMode(message, false);
		message.client.player.setLoopMode(message, false);
		message.client.player.stop(message);

		message.react("🛑");
	},
	type: 4,
	aliases: ["leave", "end"],
} as Command;
