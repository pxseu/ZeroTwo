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
		});
	});

	player.on("channelEmpty", (message) => {
		message.info("I left the channel because it was emtpy!");
	});

	player.on("botDisconnect", (message) => {
		message.info("I was disconnected from the voice channel!");
	});

	player.on("trackAdd", (message, queue, track) => {
		message.info({
			title: "Added to the queue:",
			text: `Title: [\`${track.title}\`](${track.url})\nAuthor: \`${track.author}\`\nRequested by: <@${track.requestedBy.id}>\nPosition: ${queue.tracks.length}`,
		});
	});

	player.on("noResults", (message) => {
		message.info({
			title: "No results!",
			text: "I couldn't find any results for your search querry!",
		});
	});

	player.on("error", (error, message) => {
		message.error({ text: error, title: "Player error: " });
	});

	return player;
};

export default playerCreate;
