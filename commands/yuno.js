const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "yuno",
	description: "Yuno!",
	execute(message, args) {
		const embed = new MessageEmbed();
		embed.setDescription(`Yuno will protect <@${message.author.id}>.`);
		embed.setImage("https://media.giphy.com/media/a6wJ2bJ0127K0/source.gif");
		message.channel.send(embed);
	},
	type: 3,
};
