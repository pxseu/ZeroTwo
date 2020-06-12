module.exports = {
   name: 'hug',
   description: 'Hug!',
   execute(message, args) {
      const {
         huggifs
      } = require('../config.json');
      var hug = huggifs[Math.floor(Math.random() * huggifs.length)];

      var msgContent, tagged = message.mentions.members.first();

      if (tagged != undefined){
         msgContent = message.author.username +" hugs " + tagged.user.username + " tightly (´・ω・｀)";
      } else {
         msgContent = "hugs back " + message.author.username + " tightly (´・ω・｀)";
      }
      message.channel.send({
         embed: {
            color: 10181046,
            title: msgContent,
            image: {
               url: hug
            }
         }
      });
   },
};
