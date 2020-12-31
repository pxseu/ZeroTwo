import { MessageEmbed } from "discord.js";

module.exports = {
	name: "loopsong",
	description: "loop current song",
	async execute(message) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (!message.member.voice.channel) {
			message.error("You're not in a voice channel.");
			return;
		}

		if (!message.client.player.isPlaying(message)) {
			message.error("No music playing on this server.");
			return;
		}

		const repeatMode = message.client.player.getQueue(message).repeatMode;

		if (repeatMode) {
			//@ts-expect-error Again wrong typings
			message.client.player.setRepeatMode(message, false);
			message.info("Repeat mode disabled.");
			return;
		}

		//@ts-expect-error Again wrong typings
		message.client.player.setRepeatMode(message, true);
		message.info("Repeat mode enabled.");
	},
	type: 4,
	aliases: ["loop"],
} as Command;
