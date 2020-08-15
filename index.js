require("dotenv").config()

const fs = require('fs');
const Discord = require("discord.js");
const mongoose = require('mongoose');
const Server = require('./models/server')
const {
   badword
} = require('./config.json');

mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
})

mongoose.connection.on('error', (error) => console.error(error))
mongoose.connection.once('open', () => console.log('Connected to database'))

let client = new Discord.Client();
client.commands = new Discord.Collection();
let queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.name, command, command.description);
}

client.on("guildDelete", guild => {
   Server.findOne({
      serverid: guild.id
   }).deleteOne().exec();
});

client.on('ready', () => {
   console.log(`Logged in as ${client.user.tag}!`);
   client.user.setActivity("luv u",{
      name: "online",
      type: "CUSTOM_STATUS"
   })
});

client.on('message', async message => {
   if (!message.guild || message.author.bot) return;
   const guildConf = await Server.findOne({
      serverid: message.guild.id
   })
   if (message.content.indexOf(guildConf.prefix) !== 0) return;
   const args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);
   const commandName = args.shift().toLowerCase();
   if (!client.commands.has(commandName)) return;
   const serverQueue = queue.get(message.guild.id);
   console.log(`${commandName} | summoned by ${message.author.id}`);
   const command = client.commands.get(commandName);
   try {
      command.execute(message, args, guildConf, serverQueue, queue, client, Server);
   } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
   }
});


//verification lol

const completemsg =
   `Thank you for agreeing to the rules and code of conduct! You are now a verified member of the guild! \nFeel free to choose what roles you’d like, introduce yourself or check out a our other channels. \n\n**Your unique token is your signature that you have read and understood our rules.**\n`

const shortcode = (n) => {
   const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
   let text = ''
   for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
   return text;
}

client.on('guildMemberAdd', async (member) => {
   const loaderr = await Server.findOne({
      serverid: member.guild.id
   }).then((currentServer) => {
      if (currentServer) {
         return currentServer
      } else {
         return 0
      }
   })

   if (loaderr.verification === false) return;
   if (member.user.bot || member.guild.id !== (loaderr.serverid)) return
   const token = shortcode(8)
   const welcomemsg =
      `Welcome to the server!! We hope you find a home here! Check out the \`#rules\` channel to make sure that we live, and as long as our goals are similar, then there’s a place at the table waiting for you. \n\n If you accept the code of conduct, please verify your agreement by sending a message to \`#verify-me\` with the verification phrase: \n\n\`I agree to abide by all rules. My token is ${token}.\`\n\n **This message is case-sensitive, and please include the period at the end! ** \n\nQuestions? Get at a staff member in the server or via DM.`;
   client.channels.get(loaderr.logchannel).send({
      embed: {
         color: 10181046,
         description: `${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`
      }
   })
   member.send(welcomemsg)
   member.user.token = token
})

const verifymsg = 'I agree to abide by all rules. My token is {token}.'

client.on('message', async (message) => {
   if (message.author.bot || !message.author.token || message.channel.type == `dm`) return
   const loaderrr = await Server.findOne({
      serverid: message.guild.id
   })
   if (message.content !== (verifymsg.replace('{token}', message.author.token))) return

   await message.channel.fetchMessages("2").then(messages => {
      message.channel.bulkDelete(messages)
   });
   message.member.addRole(message.guild.roles.find(role => role.name === loaderrr.roleafterver))
   .then(client.channels.get(loaderrr.logchannel).send({
         embed: {
            color: 10181046,
            description: `TOKEN: ${message.author.token} Role ${loaderrr.roleafterver} added to member ${message.author.id}`
         }
    }))
   .catch(e => {message.author.send("\`There was an error adding you the role.\`\n\n\`Please message any online staff to resolve it.\`"); return console.log(e)})
   //if (message.member.roles.find(r => r.name === loaderrr.roleafterver)) {
     console.log(1)
     message.member.send({
        embed: {
           color: Math.floor(Math.random() * (0xFFFFFF + 1)),
           description: completemsg,
           timestamp: new Date(),
           footer: {
              text: `Verification Success`
           }
        }
     })
   //}
})

client.on("guildMemberRemove", async function(member) {
   const loader = await Server.findOne({
      serverid: member.guild.id
   })
   if (loader.logging == false) return;
   client.channels.get(loader.logchannel).send({
      embed: {
         color: 10181046,
         description: `a member leaves a guild, or is kicked: ${member.user.username}#${member.user.discriminator}`
      }
   });
});

client.on("guildCreate", guild => {
   guild.owner.send('Konnichiwa ( ´ ▽ ` )\n Thank you for adding me! \n Type zt!help for commands.')
   client.user.setActivity("with " + client.channels.cache.size + " users");
   new Server({
      prefix: 'zt!',
      logchannel: '699869431207034900',
      roleafterver: '699867596991889428',
      serverid: guild.id,
      adminRole: 'Admin',
      modRole: 'Moderator',
      verification: false,
      logging: false,
      loopsongs: false
   }).save().then((newServer) => {
      console.log('Joined a new server: ' + newServer);
   })
});

client.on('message', async message => {
   if (message.author.bot || message.channel.type == `dm`) return;
   const loader = await Server.findOne({
      serverid: message.guild.id
   })
   if (badword.some(word => message.content.toLowerCase().includes(word))) {
      if (message.member.roles.cache.some(role => role.name == loader.adminRole) || message.member.roles.cache.some(role => role.name == loader.modRole))        return;  
      message.reply({
         embed: {
            color: 10181046,
            description: "Don't use swear word my guy."
         }
      });
      
      if (loader.logging == false) return;
      client.channels.get(loader.logchannel).send({
         embed: {
            color: 10181046,
            description: `${message.author.tag} said a bad word: ` + message.content
         }
      });

   }
})

client.login(process.env.BOT_TOKEN);