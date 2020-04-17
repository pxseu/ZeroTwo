const Discord = require("discord.js");
const ytdl = require("ytdl-core");
var search = require('youtube-search');
const prompter = require('discordjs-prompter');
const ytlist = require('youtube-playlist');
const Enmap = require('enmap');
const { patgifs, huggifs, badword, embed } = require('./config.json');

const client = new Discord.Client();
var queue = new Map();

client.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});

const defaultSettings = {
  prefix: "zt!",
  logchannel: "694925675710382090",
  roleafterver: "694925479513161819",
  serverid: "694925259672911963",
  adminRole: "Admin",
  modRole: "Moderator",
  verification: "0",
  logging: "0"
}

client.on("guildDelete", guild => {
  client.settings.delete(guild.id);
});

var opts = {'maxResults': 4, 'key': process.env.YTAPI_TOKEN};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("with "+client.guilds.size+" users");
});

client.on('message', async message => {
  if(!message.guild || message.author.bot) return;
  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
  if(message.content.indexOf(guildConf.prefix) !== 0) return;
  const args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const serverQueue = queue.get(message.guild.id);
  console.log(command);
  switch(command){               //swtich głowny

//////////////////////////////////////////////////////////////////

    case "ping":
      message.reply("pong");
      return 0;

    case "owner":
      message.channel.send({embed: {color: 10181046, title:"My owner is pxseu#6944", description: "[OWNERS WEBSITE](https://pxseu.cc)" }});
      return 0;
/////////////////// GIF //////////////////////////////////////////

    case "hug":
      var hug = huggifs[Math.floor(Math.random() * huggifs.length)];
      message.channel.send({embed: {color: 10181046, title:"hugs back "+message.author.username+" tightly (´・ω・｀)", image:  {url: hug}}});
      return 0;

    case "ricardo":
      message.channel.send({embed: {color: 10181046, title:"Ricardo has been summoned by "+message.author.username+".", image:  {url: "https://media.giphy.com/media/UtcBRO8cxulRzkrVLc/giphy.gif"}}});
      return 0;

    case "pat":
      var pat = patgifs[Math.floor(Math.random() * patgifs.length)];
      message.channel.send({embed: {color: 10181046, title:"Pats with love have been sent by "+message.author.username+".", image:  {url: pat}}});
      return 0;

    case "yuno":
      message.channel.send({embed: {color: 10181046, title:"Yuno will protect "+message.author.username+".", image:  {url: "https://media.giphy.com/media/a6wJ2bJ0127K0/source.gif"}}});
      return 0;

    case "vibe":
      message.channel.send({embed: {color: 10181046, title:"Zero Two vibes with "+message.author.username+".", image:  {url: "https://image.myanimelist.net/ui/G-Sm6d0qIwQxUGHIp-m2WE4r0RSD61OQcp0zIes03ZCYoKjsVsjXKaeievJ3JFbIPWVFdDFNffxoioO0_wZFCqs4E0_YgZYsXqmLfTNB-IZA-B-IvlYVs7FcQAbSVU5Z"}}});
      return 0;

    case "kawal":
        message.channel.send("puk puk");
        message.channel.send("Kto tam?");
        message.channel.send("Jebać disa.");
        return 0;

///////////////// MUSIC //////////////////////////////////////////

    case "skip":
      skip(message, serverQueue);
      return 0;

    case "stop":
      stop(message, serverQueue);
      return 0;

    case "play":
	  if (args[0].startsWith("https://www.youtube.com/", 0) || args[0].startsWith("https://youtu.be/", 0)) {message.content = guildConf.prefix+"play "+args[0]; return execute(message, serverQueue);}
      var searchterm = args.join(' ')+" (audio)";
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
            message.content = guildConf.prefix+"play "+results[0].link;
            execute(message, serverQueue);
            return 0;
          case "👆":
            message.content = guildConf.prefix+"play "+results[1].link;
            execute(message, serverQueue);
            return 0;
          case "👇":
            message.content = guildConf.prefix+"play "+results[2].link;
            execute(message, serverQueue);
            return 0;
          case "👉":
            message.content = guildConf.prefix+"play "+results[3].link;
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


/*    case "playlist":
      const args = message.content.split(' ');
      console.log(args[1]);
      const voiceChannel = message.member.voiceChannel;
      ytlist(args[1], 'url').then( async res => {
        for (var i = 0; i < res.data.playlist.length; i++) {
          const songInfo = await ytdl.getInfo(res.data.playlist[i]);
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
        } console.log(queueContruct.songs)
      });
      return 0;
*/

//////////////////MISC////////////////////////////////////////////

    case "darling":
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
         .then(connection => {
	   const dispatcher = connection.playFile('./mp3/darling.mp3');
           dispatcher.on("end", end => {message.member.voiceChannel.leave();});
      }).catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
      return 0;

    case "czesio":
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
         .then(connection => {
	   const dispatcher = connection.playFile('./mp3/czesio.mp3');
           dispatcher.on("end", end => {message.member.voiceChannel.leave();});
      }).catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
      return 0;

    case "jd":
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
         .then(connection => {
	   const dispatcher = connection.playFile('./mp3/jd.mp3');
           dispatcher.on("end", end => {message.member.voiceChannel.leave();});
      }).catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
      return 0;

    case "szmaciura":
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
         .then(connection => {
	   const dispatcher = connection.playFile('./mp3/szmaciura.mp3');
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

    case "clear":
      if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)){
       const bruh = message.content.split(' ').slice(1);
       const amount = bruh.join(' ');

       if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!');
       if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!');

       if (amount > 200) return message.reply('You can`t delete more than 100 messages at once!');
       if (amount < 1) return message.reply('You have to delete at least 1 message!');

       await message.channel.fetchMessages({ limit: amount }).then(messages => {
         message.channel.bulkDelete(messages
       )});
      return 0;
      } else {
       message.reply("You don't have the permision to use this command.")
       return 0;
      }

     case "help":
      message.channel.send({ embed });
      return  0;
     case "avatar":
      if (!message.mentions.users.size) {
        return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
      }
      const avatarList = message.mentions.users.map(user => {
        return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
      });
      message.channel.send(avatarList);
      return 0;
      
////////////////// EMBED /////////////////////////////////////////

     case "embedimg":
      if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)){
       imgurl = args.join(' ');
       message.channel.send({embed: {color: 10181046, image: {url: imgurl}}});
       message.delete().catch(O_o=>{});
       return 0;
     } else {
      message.reply("You don't have the permision to use this command.")
      return 0;
     }


     case "embedin":
      if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)){
       const channelid = args[0];
       args[0] = "";
       txt = args.join(' ');
       client.channels.get(channelid).send({embed: {color: 10181046, description: txt}});
       message.delete().catch(O_o=>{});
       return  0;
      } else {
       message.reply("You don't have the permision to use this command.")
       return 0;
      }
     case "embedtxt":
       if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)){
        txt = args.join(' ');
        message.channel.send({embed: {color: 10181046, description: txt}});
        message.delete().catch(O_o=>{});
        return  0;
       } else {
        message.reply("You don't have the permision to use this command.")
        return 0;
       }
////////////////// EMBED /////////////////////////////////////////
/////////////// MODERATION ///////////////////////////////////////

     case "ban":
      if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole)){
        const user = message.mentions.users.first();
        if (!user) {
          try {
            if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
             user = message.guild.members.get(args.slice(0, 1).join(' '));
             user = user.user;
          } catch (error) {
            return message.reply('Couldn\' get a Discord user with this userID!');
		      }
	      }
	      if (user === message.author) return message.channel.send('You can\'t ban yourself');
	      if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!');
	      await message.guild.ban(user)
        message.react("☑️");
        client.channels.get("694925675710382090").send({embed: {color: 10181046, description: message.mentions.users.first()+" has been banned"}})
	      return 0;
      } else {
       message.reply("You don't have the permision to use this command.")
       return 0;
      }

      case "kick":
       if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole)){
         const user = message.mentions.users.first();
         if (!user) {
           try {
             if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('Couldn\' get a Discord user with this userID!');
              user = message.guild.members.get(args.slice(0, 1).join(' '));
              user = user.user;
           } catch (error) {
             return message.reply('Couldn\' get a Discord user with this userID!');
           }
         }
         if (user === message.author) return message.channel.send('You can\'t kick yourself');
         if (!message.guild.member(user).bannable) return message.reply('You can\'t kick this user because you the bot has not sufficient permissions!');
         await message.mentions.members.first().kick();
         message.react("☑️");
         client.channels.get("694925675710382090").send({embed: {color: 10181046, description: message.mentions.users.first()+" has been kicked"}})
         return 0;
       } else {
        message.reply("You don't have the permision to use this command.")
        return 0;
       }
/////////////// MODERATION ///////////////////////////////////////
//////////////// SETUP ///////////////////////////////////////////

    case "showconf":
      let configProps = Object.keys(guildConf).map(prop => {
        return `${prop}  :  ${guildConf[prop]}\n`;
      });
      message.channel.send(`The following are the server's current configuration: \`\`\`${configProps}\`\`\``);
      return 0;
    case "setconf":
       	 if(message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)) {
       	   const [prop, ...value] = args;
           if(!client.settings.has(message.guild.id, prop)) {
             return message.reply("This key is not in the configuration.");
           }
           client.settings.set(message.guild.id, value.join(" "), prop);
           message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);
           return 0;
         }
         else {return message.reply("You're not an admin, sorry!");}
//////////////// SETUP ///////////////////////////////////////////

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
	message.react("⏭️");
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
	message.react("🛑");
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



//verification lol

const completemsg = `Thank you for agreeing to the rules and code of conduct! You are now a verified member of the guild! \nFeel free to choose what roles you’d like, introduce yourself or check out a our other channels. \n\n**Your unique token is your signature that you have read and understood our rules.**\n`

const shortcode = (n) => {
    const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
    let text = ''
    for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text;
}

client.on('guildMemberAdd', (member) => {
    const loaderr = client.settings.ensure(member.guild.id, defaultSettings);
    if (loaderr.verification == 0) return;
    if (member.user.bot || member.guild.id !== (loaderr.serverid)) return
    const token = shortcode(8)
    const welcomemsg = `Welcome to the server!! We hope you find a home here! Check out the \`#rules\` channel to make sure that we live, and as long as our goals are similar, then there’s a place at the table waiting for you. \n\n If you accept the code of conduct, please verify your agreement by sending a message to \`#verify-me\` with the verification phrase: \n\n\`I agree to abide by all rules. My token is ${token}.\`\n\n **This message is case-sensitive, and please include the period at the end! ** \n\nQuestions? Get at a staff member in the server or via DM.`;
    client.channels.get(loaderr.logchannel).send({embed: {color: 10181046, description:`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`}})
    member.send(welcomemsg)
    member.user.token = token
})

const verifymsg = 'I agree to abide by all rules. My token is {token}.'

client.on('message', async (message) => {
    if (message.author.bot || !message.author.token || message.channel.type == `dm`) return
    const loaderrr = client.settings.ensure(message.guild.id, defaultSettings);
    if (message.content !== (verifymsg.replace('{token}', message.author.token))) return
    message.author.send({
        embed: {
            color: Math.floor(Math.random() * (0xFFFFFF + 1)),
            description: completemsg,
            timestamp: new Date(),
            footer: {
                text: `Verification Success`
            }
        }
    })
    await message.channel.fetchMessages("2").then(messages => {
      message.channel.bulkDelete(messages
    )});
    client.guilds.get(loaderrr.serverid).member(message.author).addRole(loaderrr.roleafterver) // ensure this is a string in the config ("")
        .then(client.channels.get(loaderrr.logchannel).send({embed: {color: 10181046, description:`TOKEN: ${message.author.token} :: Role ${loaderrr.roleafterver} added to member ${message.author.id}`}}))
        .catch(console.error)
})

client.on("guildMemberRemove", function(member){
    const loader = client.settings.ensure(member.guild.id, defaultSettings);
    if (loader.logging == 0) return;
    client.channels.get(loader.logchannel).send({embed: {color: 10181046, description:`a member leaves a guild, or is kicked: ${member.user.username}#${member.user.discriminator}`}});
});

client.on("guildCreate", guild => {
   guild.owner.send('Konnichiwa ( ´ ▽ ` )\n Thank you for adding me! \n Type zt!help for commands.')
   console.log("Here we go again");
});

client.on('message', message => {
  if (message.author.bot || message.channel.type == `dm`) return;
  const loader = client.settings.ensure(message.guild.id, defaultSettings);
  if(badword.some(word => message.content.toLowerCase().includes(word))){
    if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)) return;
    message.reply({embed: {color: 10181046, description: "Don't use swear word my guy."}});
    if (loader.logging == 0) return;
    client.channels.get(loader.logchannel).send({embed: {color: 10181046, description:`${message.author.tag} said a bad word: `+message.content}});

  }})
client.login(process.env.BOT_TOKEN);   //process.env.BOT_TOKEN
