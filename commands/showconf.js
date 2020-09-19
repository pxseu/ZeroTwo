const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "showconf",
	description: "show current config",
	execute(message, args, guildConf, serverQueue, queue) {
		const embed = new MessageEmbed();
		embed.setDescription(
			`The following are the server's current configuration:`
		);
		embed.setColor("RANDOM");
		Object.keys(guildConf).forEach((key) => {
			embed.addField(key, guildConf[key]);
		});
		message.channel.send(embed);
	},
	type: 0,
};
