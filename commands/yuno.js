module.exports = {
   name: 'yuno',
   description: 'Yuno!',
   execute(message, args) {
      message.channel.send({
         embed: {
            color: 10181046,
            title: "Yuno will protect " + message.author.username + ".",
            image: {
               url: "https://media.giphy.com/media/a6wJ2bJ0127K0/source.gif"
            }
         }
      });
   }
}
