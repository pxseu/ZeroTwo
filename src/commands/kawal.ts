import { Message } from "discord.js";

module.exports = {
	name: "kawal",
	description: "kawal",
	execute(message: Message) {
		message.channel.send("puk puk");
		message.channel.send("Kto tam?");
		message.channel.send("Jebać disa.");
	},
	type: 3,
};