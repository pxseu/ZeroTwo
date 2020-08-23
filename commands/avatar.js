const { MessageEmbed } = require("discord.js")

module.exports = {
   name: 'avatar',
   description: 'show user avatars',
   execute(message, args) {
      let member = message.mentions.members.first()
      || message.guild.members.cache.get(args[0])
      || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase())
      || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
      || message.member;
   
      const embed = new MessageEmbed();
      embed.setDescription(`${ member.user.id == message.author.id ? "Your" : `${member.displayName ? member.displayName : member.user.username}'s`} avatar`)
      embed.setImage(member.user.displayAvatarURL({ dynamic: true }));

      message.channel.send(embed);
   },
   type: 1
};