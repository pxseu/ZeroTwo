const { MessageEmbed } = require("discord.js");

module.exports = {
   name: 'embedimg',
   description: 'Embed an image',
   async execute(message, args, guildConf) {
      if (message.member.roles.cache.some(role => role.name == guildConf.adminRole)
      || message.member.roles.cache.some(role => role.name == guildConf.modRole)
      || message.author.id == "338718840873811979") {
         
         imgurl = args.join(' ');
         if (!validURL(imgurl)) return  message.reply("This is not a valid image url!");

         const embed = new MessageEmbed();
         embed.setColor("RANDOM");
         embed.setDescription(`[Image](${imgurl})`);
         embed.setImage(imgurl);
         message.channel.send(embed);
      } else {
         message.reply("You don't have the permision to use this command.")
      }
      message.delete().catch(O_o => {});
   },
   type: 2
}

function validURL(str) {
   var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
   return !!pattern.test(str);
}
