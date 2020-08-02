const search = require('youtube-search');
const prompter = require('discordjs-prompter');
const ytdl = require("ytdl-core");
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'play',
  description: 'Play song!',
  async execute(message, args, guildConf, serverQueue, queue, client, Server) {
    const guildconfdata = guildConf;
    
    var opts = {
      maxResults: 4,
      key: process.env.YTAPI_TOKEN
    };
    if (args[0].startsWith("https://", 0) || args[0].startsWith("http://",
        0)) {
      message.content = guildconfdata.prefix + "play " + args[0];
      return execute(message, serverQueue, guildConf);
    }
    var searchterm = args.join(' ');
    search(searchterm, opts, async function(err, results) {
      const response = await prompter.choice(message.channel, {
        question: {
          embed: {
            "title": "Choose the song: (wait for all 4 emojis to show up)",
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
        },
        choices: ['👈', '👆', '👇', '👉'],
        userId: message.author.id
      }).catch((e) => {console.log(e); message.channel.send("I fucking told you to wait.")})
      switch (response) {
        case "👈":
          message.content = guildconfdata.prefix + "play " + results[0].link;
          execute(message, serverQueue, guildConf);
          return 0;
        case "👆":
          message.content = guildconfdata.prefix + "play " + results[1].link;
          execute(message, serverQueue, guildConf);
          return 0;
        case "👇":
          message.content = guildconfdata.prefix + "play " + results[2].link;
          execute(message, serverQueue, guildConf);
          return 0;
        case "👉":
          message.content = guildconfdata.prefix + "play " + results[3].link;
          execute(message, serverQueue, guildConf);
          return 0;
        default:
          return 0;
      }
    });

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

    async function execute(message, serverQueue, guildConf) {
      const embed = new MessageEmbed()

      loopchck(guildConf, message);
      const args = message.content.split(' ');
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        embed.setTitle(`error`);
        embed.setDescription('You need to be in a voice channel to play music!');
        embed.setColor("RANDOM");
        return message.channel.send(embed)
      }
        

      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        embed.setTitle(`error`);
        embed.setDescription('I need the permissions to join and speak in your voice channel!');
        embed.setColor("RANDOM");
        return message.channel.send(embed)
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
        embed.setTitle(`Succes.`);
        embed.setColor("RANDOM");
        embed.setDescription(`${song.title} has been added to the queue!`);
        return message.channel.send(embed)
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
      const embed = new MessageEmbed();
      embed.setTitle(`Now playing:`);
      embed.setColor("RANDOM");
      embed.setDescription(`${song.title}`);
      message.channel.send(embed)
    }
  }
}
