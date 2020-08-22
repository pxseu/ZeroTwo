const { MessageEmbed } = require("discord.js");
const { bypassIds } = require("../config.json");

module.exports = {
   name: 'embedtxt',
   description: 'Embed an text',
   async execute(message, args, guildConf) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole)
      || message.member.roles.cache.some(role => role.name == guildConf.modRole)
      || bypassIds.some(id => id == message.author.id)) {
         txt = args.join(' ');
         if (txt == undefined) return message.reply("Message cannot bee empty.");

         const embed = new MessageEmbed();
         embed.setColor("RANDOM");
         embed.setDescription(txt);
         message.channel.send(embed);
      } else {
         message.reply("You don't have the permision to use this command.")
      }
      message.delete().catch(O_o => {});
   },
   type: 2
}
