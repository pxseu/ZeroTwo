import { Util } from "discord.js";

module.exports = {
	name: "say",
	description: "Same something with the bot!",
	execute(message, args) {
		const text = args.join(" ");
		const regex = /^i('?|\s+a)m\s+((so+|very|really)\s+)?(stupid|dum+b?)$/gi;

		if (!text) {
			message.error("No text was provided!");
			return;
		}

		if (regex.test(text.trim())) {
			message.info("I know.");
			return;
		}
		const cleanText = Util.cleanContent(text, message).replace(/@(everyone|here)/gi, replacer);

		message.channel.send(cleanText);
	},
	type: 2,
} as Command;

function replacer(_, mention: string): string {
	return `@${String.fromCharCode(8203)}${mention}`;
}
