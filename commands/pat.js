const { MessageEmbed } = require('discord.js');

module.exports = {
   name: 'pat',
   description: 'Pats!',
   execute(message, args) {
      const {
         patgifs
      } = require('../config.json');
      
      const pat = patgifs[Math.floor(Math.random() * patgifs.length)];

      let msgContent;
      const tagged = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());

      if (tagged != undefined && tagged.id != message.author.id){
         msgContent = `<@${message.author.id}> pats <@${tagged.id}> with lots of love.`;
      } else {
         msgContent = `Pats with love have been sent to <@${message.author.id}>.`;
      }

      const embed = new MessageEmbed();
      embed.setColor("RANDOM");
      embed.setDescription(msgContent)
      embed.setImage(pat)
      message.channel.send(embed);
   },
   type: 3
}
