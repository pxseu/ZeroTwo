module.exports = {
   name: 'loopsong',
   description: 'loop current song',
   async execute(message, args, guildConf, serverQueue, queue, client, Server) {
      if (!message.member.voiceChannel) {return message.channel.send(
         'You have to be in a voice channel to stop the music!');}
      if (!serverQueue){ return message.channel.send('There is no song that I could skip!')};
      if (guildConf.loopsongs == false){   
         await Server.updateOne({
            serverid : message.guild.id
         }, {
            loopsongs : true
         });
         message.react("🔄");
         message.channel.send("Looping: "+ serverQueue.songs[0].title).then(msg => {
           msg.delete(5000)
         });
      } else {
         await Server.updateOne({
            serverid: message.guild.id
         }, {
            loopsongs: false
         });
         message.react("🛑");
      }
   }
}
