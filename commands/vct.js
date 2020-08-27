module.exports = {
	name: 'vct',
	description: 'Test bot connection',
	execute(message, args) {
		function vctest(message) {
			if (message.member.voice.channel) {
				message.member.voice.channel
					.join()
					.then((connection) => {
						message.reply('I have successfully connected to the channel!');
					})
					.catch(console.log);
			} else {
				message.reply('You need to join a voice channel first!');
			}
		}
		vctest(message);
	},
	type: 0,
};
