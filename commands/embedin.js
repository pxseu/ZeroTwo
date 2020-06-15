module.exports = {
   name: 'embedin',
   description: 'Embed text in specific channel',
   async execute(message, args, guildConf, serverQueue, queue, client) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole) || message.member.roles.cache.some(role => role.name == guildConf.modRole)) {
         const channelid = args[0];
         args[0] = "";
         txt = args.join(' ');
         client.channels.cache.get(channelid).send({
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
   }
}
