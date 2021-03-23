module.exports = {
	name: "songprogress",
	description: "get song progress",
	async execute(message) {
		if (!message.member.voice.channel) {
			message.error("You're not in a voice channel.");
			return;
		}

		//If there's no music
		if (!message.client.player.isPlaying(message)) {
			message.error("No music playing on this server.");
			return;
		}

		const song = message.client.player.nowPlaying(message);

		//Message
		message.info({
			title: "Currently playing: ",
			text: `Title: \`${song.title}\`\nAuthor: ${
				song.author
			}\nProgress: [${message.client.player.createProgressBar(message, {
				timecodes: false,
			})}]`,
		});
	},
	type: 4,
	aliases: ["progress"],
} as Command;
