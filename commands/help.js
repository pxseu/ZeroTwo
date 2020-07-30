module.exports = {
   name: 'help',
   description: 'Halp me',
   execute(message, args) {
      
      const embed = embedhelp
      message.channel.send({
         embed
      });
   },
};
