const { bypassIds } = require("../config.json");

module.exports = {
   name: 'clear',
   description: 'clear channel',
   async execute(message, args, guildConf) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole)
      || message.member.roles.cache.some(role => role.name == guildConf.modRole)
      ||  bypassIds.some(id => id == message.author.id)) {
         const amount = args.join(' ');
         if (!amount) return message.reply(
            'You haven\'t given an amount of messages which should be deleted!');
         if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!');
         if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!');
         if (amount < 1) return message.reply('You have to delete at least 1 message!');
         if (!message.deleted) message.delete();
         await message.channel.messages.fetch({
            limit: amount
         }).then(messages => {
            message.channel.bulkDelete(messages);
            message.channel.send(`Succesfully deleted: ${amount} messages.`).then((msg) => {
               setTimeout(() => {
                  msg.delete();
               }, 4000)
            })
         });
         return 0;
      } else {
         message.reply("You don't have the permision to use this command.")
         return 0;
      }
   },
   type: 2
};
