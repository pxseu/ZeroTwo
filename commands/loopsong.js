module.exports = {
	name: 'loopsong',
	description: 'loop current song',
	async execute(message, args, guildConf, serverQueue, queue, client, Server) {
		if (!message.member.voice.channel) {
			return message.channel.send(
				'You have to be in a voice channel to loop the music!'
			);
		}
		if (!serverQueue) {
			return message.channel.send('There is no song that I could skip!');
		}
		if (serverQueue.loop == false) {
			serverQueue.loop = true;
			message.react('🔄');
			message.channel.send('Looping: ' + serverQueue.songs[0].title);
		} else {
			serverQueue.loop = false;
			message.react('🛑');
		}
	},
	type: 4,
};
