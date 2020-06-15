module.exports = {
   name: 'embedimg',
   description: 'Embed an image',
   async execute(message, args, guildConf) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole) || message.member.roles.cache.some(role => role.name == guildConf.modRole)) {
         imgurl = args.join(' ');
         message.channel.send({
            embed: {
               color: 10181046,
               image: {
                  url: imgurl
               }
            }
         });
         message.delete().catch(O_o => {});
      } else {
         message.reply("You don't have the permision to use this command.")
      }
   }
}
