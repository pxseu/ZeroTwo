const search = require('youtube-search');
const ytdl = require("ytdl-core");

module.exports = {
    name: "mimic",
    description: "Mimic users Spotify",
    execute(message, args, guildConf, serverQueue, queue, client, Server) {

        var isMimick = false;

        var opts = {
            maxResults: 1,
            key: process.env.YTAPI_TOKEN
          };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

        user.presence.activities.forEach((activity) => {
            if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {
                let trackName = activity.details;
                let trackAuthor = activity.state;
                //let trackAlbum = activity.assets.largeText;
                trackAuthor = trackAuthor.replace(/;/g, ",")

                isMimick = true;

                var searchterm = trackAuthor + " " + trackName
                search(searchterm, opts, async function(err, results) {
                    message.content = guildConf.prefix + "play " + results[0].link;
                    execute(message, serverQueue, guildConf);
                })
            }
        })
        if (!isMimick){
            message.channel.send("Nothing to mimic.")
        }
        async function execute(message, serverQueue, guildConf) {
            loopchck(guildConf, message);
            const args = message.content.split(' ');
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(
              'You need to be in a voice channel to play music!'
            );
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
                loop: false
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
              return message.channel.send(`${song.title} has been added to the queue!`)
            }
        }
      
        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
            const dispatcher = serverQueue.connection.play(ytdl(song.url))
                .on('finish', async () => {
                if (serverQueue.loop == true) {
                    return play(guild, serverQueue.songs[0])
                } else {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                }
                })
                .on('error', error => {
                console.error(error);
                });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        }

        async function loopchck(guildConf, message) {
            if (guildConf.loopsongs == true) {
              const response = await prompter.choice(message.channel, {
                question: 'Stop the loop?',
                choices: ['👍', '👎'],
                userId: message.author.id
              }).catch((e) => {
                console.log(e)
              })
              switch (response) {
                case "👍":
                  await Server.updateOne({
                    serverid: message.guild.id
                  }, {
                    loopsongs: false
                  });
                  message.react("🛑");
                  return 0;
                case "👎":
                  message.react("🔄");
                  return 0;
                default:
                  return 0;
              }
            }
          }
    }
}