module.exports = {
	name: "vct",
	description: "Test bot connection",
	execute(message) {
		if (!message.member.voice.channel) {
			message.info("You need to join a voice channel first!");
			return;
		}
		message.member.voice.channel
			.join()

			.then((con) => {
				message.info("I have successfully connected to the channel!");
				con.disconnect();
			})

			.catch(/* */);
	},
	type: 0,
} as Command;
