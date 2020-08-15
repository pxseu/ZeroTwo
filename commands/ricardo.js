module.exports = {
   name: 'ricardo',
   description: 'Ricardo!',
   execute(message, args) {
      message.channel.send({
         embed: {
            color: 10181046,
            title: "Ricardo has been summoned by " + message.author.username + ".",
            image: {
               url: "https://media.giphy.com/media/UtcBRO8cxulRzkrVLc/giphy.gif"
            }
         }
      });
   },
   type: 3
};
