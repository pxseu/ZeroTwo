module.exports = {
	name: "darling",
	description: "Dahling!",
	async execute(message) {
		if (!message.member.voice.channel) {
			message.info("You need to join a voice channel first!");
			return;
		}

		try {
			const connection = await message.member.voice.channel.join();

			const dispatcher = connection.play("./mp3/darling.mp3");
			dispatcher.on("finish", () => {
				message.guild.voice.channel.leave();
			});
		} catch (_) {
			message.error("I couldn't join your channel.");
		}
	},
	type: 3,
	cooldown: 10,
} as Command;
