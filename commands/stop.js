module.exports = {
   name: 'stop',
   description: 'stop',
   async execute(message, args, guildConf, serverQueue, queue, client, Server) {
      if (!message.member.voiceChannel) return message.channel.send(
         'You have to be in a voice channel to stop the music!'
      );
      await Server.updateOne({
        serverid: message.guild.id
      }, {
        loopsongs: false
      })
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      message.react("🛑");
   }
}
