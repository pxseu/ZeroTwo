const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	description: "queue",
	execute(message) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to stop the music!"
			);
		const queue = message.client.player.getQueue(message.guild.id);

		if (!queue) return message.channel.send(`No songs currently playing`);

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setDescription(
			`**Server queue: **\nCurrent - \`${queue.playing.name}\` | \`${queue.playing.author}\`\n` +
				queue.tracks
					.map((track, i) => {
						return `#${i + 1} - \`${track.name}\` | \`${track.author}\``;
					})
					.join("\n")
		);
		message.channel.send(embed);
	},
	type: 4,
};
