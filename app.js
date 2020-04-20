const fs = require('fs');
const Discord = require("discord.js");
const prompter = require('discordjs-prompter');
const Enmap = require('enmap');
const { badword, embedhelp, defaultSettings } = require('./config.json');


const client = new Discord.Client();
client.commands = new Discord.Collection();
var queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
client.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});

client.on("guildDelete", guild => {
  client.settings.delete(guild.id);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("with "+client.guilds.size+" users");
});

client.on('message', async message => {
  if(!message.guild || message.author.bot) return;
  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
  if(message.content.indexOf(guildConf.prefix) !== 0) return;
  const args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  if (!client.commands.has(commandName)) return;
  const serverQueue = queue.get(message.guild.id);
  console.log(commandName);
  const command = client.commands.get(commandName);
  try {
    command.execute(message, args, guildConf, serverQueue, queue, client);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});


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
    if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === loader.adminRole) || message.member.roles.find(r => r.name === loader.modRole)) return;
    message.reply({embed: {color: 10181046, description: "Don't use swear word my guy."}});
    if (loader.logging == 0) return;
    client.channels.get(loader.logchannel).send({embed: {color: 10181046, description:`${message.author.tag} said a bad word: `+message.content}});

  }})

client.login(process.env.BOT_TOKEN);
