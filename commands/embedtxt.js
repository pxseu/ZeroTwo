module.exports = {
   name: 'embedtxt',
   description: 'Embed an text',
   async execute(message, args, guildConf) {
      if (message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r
            .name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member
         .roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name ===
            guildConf.modRole)) {
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
   }
}