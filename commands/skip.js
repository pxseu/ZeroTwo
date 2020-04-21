module.exports = {
   name: 'skip',
   description: 'skip',
   async execute(message, args, guildConf, serverQueue, ) {
      if (!message.member.voiceChannel) return message.channel.send(
         'You have to be in a voice channel to stop the music!');
      if (!serverQueue) return message.channel.send('There is no song that I could skip!');
      await Server.updateOne({
        serverid: message.guild.id
      }, {
        loopsong: false
      });
      serverQueue.connection.dispatcher.end();
      message.react("⏭️");
   }
}
