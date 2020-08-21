const { MessageEmbed } = require('discord.js');

module.exports = {
   name: 'fursona',
   description: 'Generate a random fursona!',
   execute(message, args, guildConf, serverQueue, queue, client) {
      const user = message.member;

      const embed = new MessageEmbed();
      embed.setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }));
      embed.setColor("RANDOM");
      embed.setFooter(message.guild.name, message.guild.iconURL());
      embed.setTimestamp();
      embed.setImage(`https://thisfursonadoesnotexist.com/v2/jpgs-2x/seed${Math.floor(Math.random() * 100000)}.jpg`)
      return message.channel.send(embed);
   },
   type: 3
};