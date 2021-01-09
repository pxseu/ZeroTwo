import { Util } from "discord.js";

module.exports = {
	name: "say",
	execute(message, args) {
		const text = args.join(" ");

		if (!text) {
			message.error("No text was provided!");
			return;
		}

		const cleanText = Util.cleanContent(text, message).replace(/@(everyone|here)/gi, replacer);

		message.channel.send(cleanText);
	},
	type: 2,
} as Command;

function replacer(_, mention: string): string {
	console.log(mention);
	return `@${String.fromCharCode(8203)}${mention}`;
}
