module.exports = {
	name: 'skip',
	description: 'skip',
	async execute(message, args, guildConf, serverQueue, queue, client, Server) {
		if (!message.member.voice.channel)
			return message.channel.send(
				'You have to be in a voice channel to skip the music!'
			);
		if (!serverQueue)
			return message.channel.send('There is no song that I could skip!');
		serverQueue.loop = false;
		serverQueue.connection.dispatcher.end();
		message.react('⏭️');
	},
	type: 4,
};
