module.exports = {
   name: 'skip',
   description: 'skip',
   execute(message, args, guildConf, serverQueue, ) {
      if (!message.member.voiceChannel) return message.channel.send(
         'You have to be in a voice channel to stop the music!');
      if (!serverQueue) return message.channel.send('There is no song that I could skip!');
      serverQueue.connection.dispatcher.end();
      message.react("⏭️");
   }
}
