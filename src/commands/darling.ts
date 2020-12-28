module.exports = {
	name: "darling",
	description: "Dahling!",
	execute(message) {
		if (!message.member.voice.channel) {
			message.reply("You need to join a voice channel first!");
			return;
		}

		message.member.voice.channel
			.join()
			.then((connection) => {
				const dispatcher = connection.play("./mp3/darling.mp3");
				dispatcher.on("finish", () => {
					message.guild.voice.channel.leave();
				});
			})
			.catch(console.error);
	},
	type: 3,
	cooldown: 10,
} as Command;
