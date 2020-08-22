const { MessageEmbed } = require("discord.js");
const { bypassIds } = require("../config.json");

module.exports = {
   name: 'embedin',
   description: 'Embed text in specific channel',
   async execute(message, args, guildConf, serverQueue, queue, client) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole)
      || message.member.roles.cache.some(role => role.name == guildConf.modRole)
      || bypassIds.some(id => id == message.author.id)) {
         const channelid = args[0];
         args[0] = "";
         txt = args.join(' ');

         if (channelid == undefined) return message.reply('No channel Id was provided.');
         if (txt == undefined) return message.reply("Message cannot bee empty.");
         const embed = new MessageEmbed();
         embed.setColor("RANDOM");
         embed.setDescription(txt);
         client.channels.cache.get(channelid).send(embed);
      } else {
         message.reply("You don't have the permision to use this command.")
      }
      message.delete().catch(O_o => {});
   },
   type: 2
}
