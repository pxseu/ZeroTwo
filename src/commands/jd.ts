import { Message } from "discord.js";

module.exports = {
	name: "jd",
	description: "Jebac Disa",
	execute(message: Message) {
		if (!message.member.voice.channel) {
			return message.reply("You need to join a voice channel first!");
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
};
