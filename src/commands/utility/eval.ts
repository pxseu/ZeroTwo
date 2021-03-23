import vm from "vm";
import { bypassIds } from "../../utils/config";
import { inspect } from "util";
import { Util } from "discord.js";
import { Message } from "discord.js";
import { Imperial } from "imperial-node";

const wrapper = new Imperial(process.env.IMPERIAL_TOKEN);

module.exports = {
	name: "eval",
	description: `Dev Eval`,
	async execute(message, args) {
		if (!Object.keys(bypassIds).some((id) => id == message.author.id)) {
			return;
		}

		try {
			const code = args.join(" ");
			const script = new vm.Script(code, {
				filename: "pxseu_amazing_eval_machine.js",
				displayErrors: true,
				timeout: 30000,
			});

			const context = vm.createContext({
				...globalThis,
				...{
					message,
					args,
					h,
					kill: process.exit,
				},
			});

			let evaled = await script.runInContext(context);

			if (typeof evaled !== "string") evaled = inspect(evaled);

			isTooLong(message, Util.escapeCodeBlock(evaled));
		} catch (err) {
			isTooLong(message, `${Util.escapeCodeBlock(String(err.stack ? err.stack : err))}`);
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
		const response = await wrapper.createDocument(text, { instantDelete: true, longerUrls: true });

		message.info(`Message was too long: <${response.formattedLink}>`);
	} catch (error) {
		console.error(error);
		message.error(error.message ?? "Unknown");
	}

	message.channel.stopTyping();
}
