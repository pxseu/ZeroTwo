module.exports = {
	name: "czesio",
	description: "Czesio Czesio Czesio Czesio",
	execute(message) {
		if (!message.member.voice.channel) {
			message.info("You need to join a voice channel first!");
			return;
		}

		message.member.voice.channel
			.join()
			.then((connection) => {
				const dispatcher = connection.play("./mp3/czesio.mp3");
				dispatcher.on("finish", () => {
					message.member.voice.channel.leave();
				});
			})
			.catch(console.error);
	},
	type: 3,
	cooldown: 10,
} as Command;
