module.exports = {
	name: "jd",
	description: "Jebac Disa",
	execute(message) {
		if (!message.member.voice.channel) {
			message.info("You need to join a voice channel first!");
			return;
		}

		message.member.voice.channel
			.join()
			.then((connection) => {
				const dispatcher = connection.play("./mp3/jd.mp3");
				dispatcher.on("finish", () => {
					message.member.voice.channel.leave();
				});
			})
			.catch(console.log);
	},
	type: 3,
	cooldown: 10,
} as Command;
