import vm from "vm";
import { bypassIds, embedColor } from "../utils/config";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";
import { Util } from "discord.js";
import { Message } from "discord.js";
import { Imperial } from "imperial-node";

const wrapper = new Imperial(process.env.IMPERIAL_TOKEN);

module.exports = {
	name: "eval",
	description: `Dev Eval`,
	async execute(message, args) {
		if (Object.keys(bypassIds).some((id) => id == message.author.id) == false) {
			const embed = new MessageEmbed();
			embed.setColor(embedColor);
			embed.setDescription(
				`${Object.keys(bypassIds)
					.map((id) => `<@${id}>`)
					.join(", ")}.`
			);
			message.channel.send(embed);
			return;
		}

		try {
			const code = args.join(" ");
			const script = new vm.Script(code);

			const context = {
				...globalThis,
				...{
					message,
					args,
					h,
					kill: process.exit,
				},
			};

			vm.createContext(context);
			let evaled = await script.runInContext(context);

			if (typeof evaled !== "string") evaled = inspect(evaled);

			isTooLong(message, Util.escapeCodeBlock(evaled));
		} catch (err) {
			isTooLong(message, `Error: \n${Util.escapeCodeBlock(String(err))}`);
		}
	},
	type: 0,
} as Command;

function h() {
	return "h";
}

async function isTooLong(message: Message, text: string): Promise<void> {
	if (text.length < 2001) {
		message.channel.send(text, { code: "xl" });
		return;
	}
	message.channel.startTyping();

	try {
		const response = await wrapper.postCode(text, { instantDelete: true, longerUrls: true });

		message.info(`Message was too long: <${response.formattedLink}>`);
	} catch (error) {
		console.error(error);
		message.error(error.message ?? "Unknown");
	}

	message.channel.stopTyping();
}
