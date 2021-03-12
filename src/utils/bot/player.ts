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
		message.info(
			{
				title: "Now playing:",
				text: `Title: [\`${track.title}\`](${track.url})\nAuthor: \`${track.author}\`\nRequested by: <@${track.requestedBy.id}>`,
			},
			2000
		);
	});

	player.on("channelEmpty", (message) => {
		message.info({ text: "I left the channel because it was emtpy!" }, 2000);
	});

	player.on("botDisconnect", (message) => {
		message.info({ text: "I was disconnected from the voice channel!" }, 2000);
	});

	player.on("trackAdd", (message, queue, track) => {
		message.info(
			{
				title: "Added to the queue:",
				text: `Title: [\`${track.title}\`](${track.url})\nAuthor: \`${track.author}\`\nRequested by: <@${track.requestedBy.id}>\nPosition: ${queue.tracks.length}`,
			},
			2000
		);
	});

	player.on("noResults", (message) => {
		message.info(
			{
				title: "No results!",
				text: "I couldn't find any results for your search querry or your playlist is private!",
			},
			2000
		);
	});

	player.on("playlistParseStart", (_, message) => {
		message.info(
			{
				title: "Parsing playlist",
				text: `I started to parse the playlist.`,
			},
			5000
		);
	});

	player.on("playlistAdd", (message, _, playlist) => {
		message.info({
			title: "Added to the queue:",
			text: `Added ${playlist.tracks.length} song(s) from the playlist.`,
		});
	});

	player.on("error", (error, message) => {
		message.error({ text: error, title: "Player error:" }, 5000);
	});

	return player;
};

export default playerCreate;
