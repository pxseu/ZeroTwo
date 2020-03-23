const Discord = require("discord.js"); 
const ytdl = require("ytdl-core");
var search = require('youtube-search');
const prompter = require('discordjs-prompter');
const ytlist = require('youtube-playlist');


const client = new Discord.Client();
var queue = new Map();

// usun przed uploadem //////////////////////////////////////////////////////////////////////////////
var opts = {'maxResults': 5, 'key': process.env.YTAPI_TOKEN}; //process.env.YTAPI_TOKEN
const prefix = "zt!";

// usun przed uploadem //////////////////////////////////////////////////////////////////////////////

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Hiro's feelings");
});

client.on('message', async message => {
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const serverQueue = queue.get(message.guild.id);
  console.log(command);
  switch(command){               //swtich głowny

//////////////////////////////////////////////////////////////////

    case "ping":
      message.reply("pong");
      return 0;

    case "owner":
      message.channel.send({embed: {color: 10181046, title:"My owner is pxseu#6944", description: "[OWNERS WEBSITE](https://modman276.github.io)" }});
      return 0;
/////////////////// GIF //////////////////////////////////////////

    case "hug":
      message.channel.send({embed: {color: 10181046, title:"hugs back "+message.author.username+" tightly (´・ω・｀)", image:  {url: "https://media.giphy.com/media/ddGxYkb7Fp2QRuTTGO/giphy.gif"}}});
      return 0;

    case "ricardo":
      message.channel.send({embed: {color: 10181046, title:"Ricardo has been summoned by "+message.author.username, image:  {url: "https://media.giphy.com/media/UtcBRO8cxulRzkrVLc/giphy.gif"}}});
      return 0;
/*
    case "gif":
      if (typeof args[0] === "undefined") { return console.log("err");}
      gife = args.join(' ')
      //gife = gife.replace(/ /g, "+");
      giphy.search({
    	   q: 'gife',
   	     rating: 'g',
         limit: "1"
	      }, function (err, res) {
    		    console.log(res)
	      });
      return 0;
*/
///////////////// MUSIC //////////////////////////////////////////

    case "play":
      execute(message, serverQueue);
      return 0;

    case "skip":
      skip(message, serverQueue);
      return 0;

    case "stop":
      stop(message, serverQueue);
      return 0;

    case "search":
      searchterm = args.join(' ')+" (audio)";
      console.log(searchterm);
      search(searchterm, opts, async function(err, results) {
          message.channel.send({embed:{
          "color": 10181046,
          "fields": [
            {
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
        }}) .then(msg => {msg.delete(10000)});
        const response = await prompter.choice(message.channel, {
          question: 'Choose a song!',
          choices: ['👈','👆', '👇','👉'],
          userId: message.author.id
        });
        switch (response) {
          case "👈":
            message.content = prefix+"play "+results[0].link;
            execute(message, serverQueue);
            return 0;
          case "👆":
            message.content = prefix+"play "+results[1].link;
            execute(message, serverQueue);
            return 0;
          case "👇":
            message.content = prefix+"play "+results[2].link;
            execute(message, serverQueue);
            return 0;
          case "👉":
            message.content = prefix+"play "+results[3].link;
            execute(message, serverQueue);
            return 0;
          default:
            return 0;

          }
        });
        return 0;

    case "nextsong":
      if (typeof serverQueue.songs[1] != "undefined") {
        message.reply("The next song is: "+serverQueue.songs[1].title).then(msg => {msg.delete(5000)});
      } else { message.reply("No songs in queue").then(msg => {msg.delete(5000)});}
      return 0;

/*
    case "playlist":
      const args = message.content.split(' ');
      console.log(args[1]);
      ytlist(args[1], 'url').then( async res => {
        message.content = prefix+"play "+res.data.playlist[0];
        execute(message, serverQueue);
      });
      return 0;
*/
       
//////////////////MISC////////////////////////////////////////////
      
    case "darling":
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
         .then(connection => {
	   const dispatcher = connection.playFile('./darling.mp3');
           dispatcher.on("end", end => {message.member.voiceChannel.leave();});
      }).catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
      
      return 0;
                                                                 
//////////////////MISC////////////////////////////////////////////

    case "vct":
      vctest(message);
      return 0;

    default:
      message.reply('You need to enter a valid command!')
      return 0;
    }
});

function vctest(message) {
    if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
      .then(connection => {
        message.reply('I have successfully connected to the channel!');
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel first!');
  }
}

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
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
    return message.channel.send(`${song.title} has been added to the queue!`).then(msg => {msg.delete(5000)});
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
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
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}


client.login(process.env.BOT_TOKEN);   //process.env.BOT_TOKEN
