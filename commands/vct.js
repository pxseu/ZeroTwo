module.exports = {
	name: 'vct',
	description: 'vct.',
	execute(message, args) {
		function vctest(message) {
			if (message.member.voiceChannel) {
				message.member.voiceChannel.join()
				.then(connection => {
					message.reply('I have successfully connected to the channel!');
				})
				.catch(console.log);
			} else {
			message.reply('You need to join a voice channel first!');
			}
		}
		vctest(message);
	},
};    