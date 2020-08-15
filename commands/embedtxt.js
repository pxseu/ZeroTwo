module.exports = {
   name: 'embedtxt',
   description: 'Embed an text',
   async execute(message, args, guildConf) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole) || message.member.roles.cache.some(role => role.name == guildConf.modRole)) {
         txt = args.join(' ');
         message.channel.send({
            embed: {
               color: 10181046,
               description: txt
            }
         });
         message.delete().catch(O_o => {});
         return 0;
      } else {
         message.reply("You don't have the permision to use this command.")
         return 0;
      }
   },
   type: 2
}
