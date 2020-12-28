module.exports = {
	name: "szmaciura",
	description: "Ty no nie wiem",
	execute(message) {
		if (!message.member.voice.channel) {
			message.reply("You need to join a voice channel first!");
			return;
		}
		message.member.voice.channel
			.join()
			.then((connection) => {
				const dispatcher = connection.play("./mp3/szmaciura.mp3");
				dispatcher.on("end", () => {
					message.member.voice.channel.leave();
				});
			})
			.catch(console.error);
	},
	type: 3,
} as Command;
