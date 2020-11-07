import { Message } from "discord.js";

module.exports = {
	name: "szmaciura",
	description: "Ty no nie wiem",
	execute(message: Message) {
		if (message.member.voice.channel) {
			message.member.voice.channel
				.join()
				.then((connection) => {
					const dispatcher = connection.play("./mp3/szmaciura.mp3");
					dispatcher.on("end", (end) => {
						message.member.voice.channel.leave();
					});
				})
				.catch(console.log);
		} else {
			message.reply("You need to join a voice channel first!");
		}
	},
	type: 3,
};
