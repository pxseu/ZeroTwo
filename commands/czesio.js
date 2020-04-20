module.exports = {
	name: 'czesio',
	description: 'Czesio Czesio Czesio Czesio',
	execute(message, args) {
               if (message.member.voiceChannel) {
                 message.member.voiceChannel.join()
                   .then(connection => {
                     const dispatcher = connection.playFile('./mp3/czesio.mp3');
                     dispatcher.on("end", end => {message.member.voiceChannel.leave();});
                   }).catch(console.log);
               } else {
                 message.reply('You need to join a voice channel first!');
               }
       }
}