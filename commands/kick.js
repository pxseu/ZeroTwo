module.exports = {
   name: 'kick',
   description: 'kick user',
   async execute(message, args, guildConf, serverQueue, queue, client) {
      if (message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r
            .name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member
         .roles.find(r => r.name === guildConf.adminRole)) {
         const user = message.mentions.users.first();
         if (!user) {
            try {
               if (!message.guild.members.get(args.slice(0, 1).join(' '))) throw new Error(
                  'Couldn\' get a Discord user with this userID!');
               user = message.guild.members.get(args.slice(0, 1).join(' '));
               user = user.user;
            } catch (error) {
               return message.reply('Couldn\' get a Discord user with this userID!');
            }
         }
         if (user === message.author) return message.channel.send('You can\'t kick yourself');
         if (!message.guild.member(user).bannable) return message.reply(
            'You can\'t kick this user because you the bot has not sufficient permissions!');
         await message.mentions.members.first().kick();
         message.react("☑️");
         client.channels.get("694925675710382090").send({
            embed: {
               color: 10181046,
               description: message.mentions.users.first() + " has been kicked"
            }
         })
         return 0;
      } else {
         message.reply("You don't have the permision to use this command.")
         return 0;
      }
   }
}
