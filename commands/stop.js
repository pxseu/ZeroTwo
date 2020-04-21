module.exports = {
   name: 'stop',
   description: 'stop',
   execute(message, args, guildConf, serverQueue) {
      if (!message.member.voiceChannel) return message.channel.send(
         'You have to be in a voice channel to stop the music!');
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      message.react("🛑");
   }
}
