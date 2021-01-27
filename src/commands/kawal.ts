module.exports = {
	name: "kawal",
	description: "kawal",
	execute(message) {
		message.channel.send("puk puk");
		message.channel.send("Kto tam?");
		message.channel.send("Jebać disa.");
	},
	type: 3,
} as Command;
