module.exports = {
	name: "stop",
	description: "stop",
	async execute(message, args, guildConf, serverQueue, queue, client, Server) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to stop the music!"
			);
		serverQueue.loop = false;
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		message.react("🛑");
	},
	type: 4,
};
