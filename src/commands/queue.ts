import { Imperial } from "imperial-node";

module.exports = {
	name: "queue",
	description: "queue",
	async execute(message) {
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

		const songs = queue.tracks
			.map((track, i) => {
				return `${i == 0 ? `Current ` : `#${i + 1}`} - [\`${track.title}\`](${track.url}) | \`${
					track.author
				}\``;
			})
			.join("\n");

		let text = songs;

		if (songs.length > 2000) {
			const api = new Imperial(process.env.IMPERIAL_TOKEN);

			const response = await api.createDocument(songs, { imageEmbed: true, expiration: 1 });
			text = queue.tracks
				.filter((_, i) => i < 6)
				.map((track, i) => {
					return `${i == 0 ? `Current ` : `#${i + 1}`} - [\`${track.title}\`](${track.url}) | \`${
						track.author
					}\``;
				})
				.join("\n");
			text += `\n...and more here: ${response.formattedLink}`;
		}

		message.info({
			title: "**Server queue: **",
			text: `${text}\nTotal: ${queue.tracks.length} song${queue.tracks.length > 1 ? "s" : ""}`,
		});
	},
	type: 4,
} as Command;
