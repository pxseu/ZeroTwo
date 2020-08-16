const { MessageEmbed } = require('discord.js');

module.exports = {
   name: 'kiss',
   description: 'Kiss!',
   execute(message, args) {
      const {
         kissgifs
      } = require('../config.json');
      const kiss = kissgifs[Math.floor(Math.random() * kissgifs.length)];

      let msgContent;
      const tagged = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());

      if (tagged != undefined && tagged.id != message.author.id){
         msgContent = `<@${message.author.id}> kisses <@${tagged.id}> (vewy uwu)`;
      } else {
         msgContent = `kisses <@${message.author.id}> uwu`;
      }
      const embed = new MessageEmbed();
      embed.setColor("RANDOM");
      embed.setDescription(msgContent)
      embed.setImage(kiss)
      message.channel.send(embed);
   },
   type: 3
};
