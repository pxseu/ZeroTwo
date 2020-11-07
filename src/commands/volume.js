const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "volume",
	description: "Change bot audio play volume.",
	execute(message, args) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (!message.member.voice.channel) {
			embed.setDescription(`You're not in a voice channel.`);
			return message.channel.send(embed);
		}

		if (!message.client.player.isPlaying(message.guild.id)) {
			embed.setDescription(`No music playing on this server.`);
			return message.channel.send(embed);
		}

		if (!args[0]) {
			embed.setDescription(`Please enter a number.`);
			return message.channel.send(embed);
		}

		if (isNaN(args[0])) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}
		if (100 < args[0]) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}

		if (args[0] <= 0) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}

		if (message.content.includes("-")) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}
		if (message.content.includes("+")) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}
		if (message.content.includes(",")) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}
		if (message.content.includes(".")) {
			embed.setDescription(`Please enter a valid number.`);
			return message.channel.send(embed);
		}

		message.client.player.setVolume(message.guild.id, parseInt(args.join(" ")));

		embed.setDescription(`Volume set to \`${args.join(" ")}\``);
		message.channel.send(embed);
	},
	type: 4,
};
