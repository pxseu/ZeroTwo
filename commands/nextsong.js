module.exports = {
   name: 'nextsong',
   description: 'nextsong',
   execute(message, args, guildConf, serverQueue) {
      if (typeof serverQueue.songs[1] != "undefined") {
         message.reply("The next song is: " + serverQueue.songs[1].title).then(msg => {
            msg.delete(5000)
         });
      } else {
         message.reply("No songs in queue").then(msg => {
            msg.delete(5000)
         });
      }
   },
};
