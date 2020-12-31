module.exports = {
	name: "queue",
	description: "queue",
	execute(message) {
		if (!message.member.voice.channel) {
			message.error("You have to be in a voice channel to stop the music!");
			return;
		}
		const queue = message.client.player.getQueue(message);

		if (!queue) {
			message.channel.send(`No songs currently playing`);
			return;
		}

		if (queue.tracks.length > 5) queue.tracks.slice(0, 5);

		message.info({
			title: "**Server queue: **",
			text:
				queue.tracks
					.map((track, i) => {
						return `${i == 0 ? `Current ` : `#${i + 1}`} - [\`${track.title}\`](${
							track.url
						}) | \`${track.author}\``;
					})
					.join("\n") +
				`\nTotal: ${queue.tracks.length} song${queue.tracks.length > 1 ? "s" : ""}`,
		});
	},
	type: 4,
} as Command;
