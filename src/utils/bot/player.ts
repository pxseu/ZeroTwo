import { Player } from "discord-player";
import { Client } from "discord.js";

const playerCreate = (client: Client): Player => {
	const player = new Player(client, {
		autoSelfDeaf: true,
		leaveOnEnd: true,
		leaveOnStop: true,
		leaveOnEmpty: true,
		leaveOnEmptyCooldown: 60 * 1000,
		leaveOnEndCooldown: 60 * 1000,
	});

	player.on("trackStart", (message, track) => {
		message.info({
			title: "Now playing:",
			text: `Title: [\`${track.title}\`](${track.url})\nAuthor: \`${track.author}\`\nRequested by: <@${track.requestedBy.id}>`,
			author: track.requestedBy,
		});
	});

	player.on("channelEmpty", (message) => {
		message.info({ text: "I left the channel because it was emtpy!", author: null }, 2000);
	});

	player.on("botDisconnect", (message) => {
		message.info({ text: "I was disconnected from the voice channel!", author: null }, 2000);
	});

	player.on("trackAdd", (message, queue, track) => {
		message.info(
			{
				title: "Added to the queue:",
				text: `Title: [\`${track.title}\`](${track.url})\nAuthor: \`${track.author}\`\nRequested by: <@${track.requestedBy.id}>\nPosition: ${queue.tracks.length}`,
				author: track.requestedBy,
			},
			2000
		);
	});

	player.on("noResults", (message) => {
		message.info(
			{
				title: "No results!",
				text: "I couldn't find any results for your search querry!",
				author: null,
			},
			2000
		);
	});

	player.on("error", (error, message) => {
		message.error({ text: error, title: "Player error:", author: null }, 5000);
	});

	return player;
};

export default playerCreate;
