module.exports = {
   name: 'avatar',
   description: 'Show avatars',
   execute(message) {
      if (!message.mentions.users.size) {
         return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
      }
      const avatarList = message.mentions.users.map(user => {
         return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
      });
      message.channel.send(avatarList);
   },
};
