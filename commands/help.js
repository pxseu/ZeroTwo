const { MessageEmbed } = require('discord.js');

module.exports = {
   name: 'help',
   description: 'Halp me',
   execute(message, args, guildConf, serverQueue, queue, client) {
         let user = message.member;

         const embed = new MessageEmbed()
         .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
         .setColor("RANDOM")
         .setThumbnail(user.user.displayAvatarURL())
         .setTitle("**Results:**")
         .setFooter(message.guild.name, message.guild.iconURL())
         .setTimestamp()

      client.commands.forEach(command => {
         embed.addField(command.name, command.description)
      });
      
      return message.channel.send(embed);
   },
};
