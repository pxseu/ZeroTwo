const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "play",
	description: "Play song!",
	async execute(message, args, guildConf, serverQueue, queue) {
		const track = await message.client.player.play(
			message.member.voice.channel,
			args[0],
			message.member.id
		);

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(
			`Currently playing ${track.name}! \[<@${track.requestedBy}>\]`
		);

		message.channel.send(embed);
	},
	type: 4,
	aliases: ["p"],
};
