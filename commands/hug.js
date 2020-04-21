module.exports = {
   name: 'hug',
   description: 'Hug!',
   execute(message, args) {
      const {
         huggifs
      } = require('../config.json');
      var hug = huggifs[Math.floor(Math.random() * huggifs.length)];
      message.channel.send({
         embed: {
            color: 10181046,
            title: "hugs back " + message.author.username + " tightly (´・ω・｀)",
            image: {
               url: hug
            }
         }
      });
   },
};
