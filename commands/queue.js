module.exports = {
	name: "queue",
	description: "queue",
	async execute(message) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to stop the music!"
			);
		const queue = client.player.getQueue(message.guild.id);

		if (!queue) return message.channel.send(`No songs currently playing`);

		message.channel.send(
			`**Server queue ${emotes.queue}**\nCurrent - ${queue.playing.name} | ${queue.playing.author}\n` +
				queue.tracks
					.map((track, i) => {
						return `#${i + 1} - ${track.name} | ${track.author}`;
					})
					.join("\n")
		);
	},
	type: 4,
};
