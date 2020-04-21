module.exports = {
   name: 'play',
   description: 'Play song!',
   execute(message, args, guildConf, serverQueue, queue) {
      const guildconfdata = guildConf;
      var search = require('youtube-search');
      const prompter = require('discordjs-prompter');
      const ytdl = require("ytdl-core");
      var opts = {
         maxResults: 4,
         key: process.env.YTAPI_TOKEN
      };
      if (args[0].startsWith("https://www.youtube.com/", 0) || args[0].startsWith("https://youtu.be/",
         0)) {
         message.content = guildconfdata.prefix + "play " + args[0];
         return execute(message, serverQueue);
      }
      var searchterm = args.join(' ') + " (audio)";
      console.log(searchterm);
      search(searchterm, opts, async function(err, results) {
         message.channel.send({
            embed: {
               "color": 10181046,
               "fields": [{
                     "name": "\:point_left:",
                     "value": results[0].title
                  },
                  {
                     "name": "\:point_up_2:",
                     "value": results[1].title
                  },
                  {
                     "name": "\:point_down:",
                     "value": results[1].title
                  },
                  {
                     "name": "\:point_right:",
                     "value": results[3].title
                  }
               ]
            }
         }).then(msg => {
            msg.delete(10000)
         });
         const response = await prompter.choice(message.channel, {
            question: 'Choose a song!',
            choices: ['👈', '👆', '👇', '👉'],
            userId: message.author.id
         });
         switch (response) {
            case "👈":
               message.content = guildconfdata.prefix + "play " + results[0].link;
               execute(message, serverQueue);
               return 0;
            case "👆":
               message.content = guildconfdata.prefix + "play " + results[1].link;
               execute(message, serverQueue);
               return 0;
            case "👇":
               message.content = guildconfdata.prefix + "play " + results[2].link;
               execute(message, serverQueue);
               return 0;
            case "👉":
               message.content = guildconfdata.prefix + "play " + results[3].link;
               execute(message, serverQueue);
               return 0;
            default:
               return 0;
         }
      });
      async function execute(message, serverQueue) {
         const args = message.content.split(' ');
         const voiceChannel = message.member.voiceChannel;
         if (!voiceChannel) return message.channel.send(
            'You need to be in a voice channel to play music!');
         const permissions = voiceChannel.permissionsFor(message.client.user);
         if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return message.channel.send(
               'I need the permissions to join and speak in your voice channel!');
         }
         const songInfo = await ytdl.getInfo(args[1]);
         const song = {
            title: songInfo.title,
            url: songInfo.video_url,
         };

         if (!serverQueue) {
            const queueContruct = {
               textChannel: message.channel,
               voiceChannel: voiceChannel,
               connection: null,
               songs: [],
               volume: 5,
               playing: true,
            };
            queue.set(message.guild.id, queueContruct);
            queueContruct.songs.push(song);
            try {
               var connection = await voiceChannel.join();
               queueContruct.connection = connection;
               play(message.guild, queueContruct.songs[0]);
            } catch (err) {
               console.log(err);
               queue.delete(message.guild.id);
               return message.channel.send(err);
            }
         } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`).then(msg => {
               msg.delete(5000)
            });
         }
      }
      function play(guild, song) {
         const serverQueue = queue.get(guild.id);
         if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
         }
         const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', () => {
               //if (repeat == 1) {return play(guild, serverQueue.songs[0]);}
               serverQueue.songs.shift();
               play(guild, serverQueue.songs[0]);
            })
            .on('error', error => {
               console.error(error);
            });
         dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      }
   }
}
