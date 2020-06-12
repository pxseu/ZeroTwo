module.exports = {
   name: 'pat',
   description: 'Pats!',
   execute(message, args) {
      const {
         patgifs
      } = require('../config.json');
      
      var pat = patgifs[Math.floor(Math.random() * patgifs.length)];

      var msgContent, tagged = message.mentions.members.first();

      if (tagged != undefined){
         msgContent = message.author.username + " pats " + tagged.user.username + " with lots of love.";
      } else {
         msgContent = "Pats with love have been sent by " + message.author.username + ".";
      }
      message.channel.send({
         embed: {
            color: 10181046,
            title: msgContent,
            image: {
               url: pat
            }
         }
      })
   }
}
