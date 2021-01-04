import { Message } from "discord.js";

module.exports = {
	name: "volume",
	description: "Change bot audio play volume.",
	execute(message, args) {
		if (!message.member.voice.channel) {
			message.error("You're not in a voice channel.");
			return;
		}

		if (!message.client.player.isPlaying(message)) {
			message.error("No music playing on this server.");
			return;
		}

		if (!args[0]) {
			message.error("Please enter a number.");
			return;
		}

		if (isInvalid(message, args)) {
			message.error("Please enter a valid number.");
			return;
		}

		message.client.player.setVolume(message, parseInt(args.join(" ")));
		message.info(`Volume set to \`${args.join(" ")}\``);
	},
	type: 4,
} as Command;

function isInvalid(message: Message, args: string[]): boolean {
	let isValid = true;
	try {
		isValid =
			isNaN(parseInt(args.join(" "))) ||
			100 < parseInt(args.join(" ")) ||
			parseInt(args.join(" ")) <= 0 ||
			message.content.includes("-") ||
			message.content.includes("+") ||
			message.content.includes(",") ||
			message.content.includes(".");
	} catch (_) {
		_;
	}
	return isValid;
}
