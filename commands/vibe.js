const { MessageEmbed } = require("discord.js")

module.exports = {
   name: 'vibe',
   description: 'Vibin.',
   execute(message, args) {
      const embed = new MessageEmbed();
      embed.setColor("RANDOM");
      embed.setDescription(`Zero Two vibes with${message.author.id}.`);
      embed.setImage("https://image.myanimelist.net/ui/G-Sm6d0qIwQxUGHIp-m2WE4r0RSD61OQcp0zIes03ZCYoKjsVsjXKaeievJ3JFbIPWVFdDFNffxoioO0_wZFCqs4E0_YgZYsXqmLfTNB-IZA-B-IvlYVs7FcQAbSVU5Z");
      message.channel.send(embed)
   },
   type: 3
}
