import { Message } from "discord.js";

module.exports = {
	name: "czesio",
	description: "Czesio Czesio Czesio Czesio",
	execute(message: Message) {
		if (message.member.voice.channel) {
			message.member.voice.channel
				.join()
				.then((connection) => {
					const dispatcher = connection.play("./mp3/czesio.mp3");
					dispatcher.on("finish", () => {
						message.member.voice.channel.leave();
					});
				})
				.catch(console.log);
		} else {
			message.reply("You need to join a voice channel first!");
		}
	},
	type: 3,
	cooldown: 10,
} as Command;
