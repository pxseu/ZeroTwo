import vm from "vm";
import { bypassIds, embedColor } from "../utils/config";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";
import { Util } from "discord.js";
import fetch from "../utils/fetchWrapper";
import { Message } from "discord.js";

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

			tooLongMessage(message, Util.escapeMarkdown(evaled));
		} catch (err) {
			tooLongMessage(message, `Error: \n${Util.escapeMarkdown(String(err))}`);
		}
	},
	type: 0,
} as Command;

function h() {
	return "h";
}

interface imperialResponse {
	success: boolean;
	documentId: string;
	rawLink: string;
	formattedLink: string;
}

class FetchErrors extends Error {
	constructor(public message: string) {
		super(message);
	}
}

async function tooLongMessage(message: Message, text: string): Promise<void> {
	if (text.length < 2001) {
		message.channel.send(text, { code: "xl" });
		return;
	}
	message.channel.startTyping();
	try {
		const response = await fetch("https://www.imperialb.in/api/postCode", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			redirect: "follow",
			body: new URLSearchParams({
				code: text,
			}),
		});

		console.log(response);

		if (!response.ok || response.status != 200) {
			throw new FetchErrors("Failed to fetch.");
		}

		const api: imperialResponse = await response.json();

		console.log(api);

		if (!api.success || !api.formattedLink) {
			throw new FetchErrors("Invalid response from the api.");
		}

		message.channel.send(`Message was too long: <${api.formattedLink}>`);
	} catch (error) {
		if (error.type == "invalid-json") {
			message.error("Failed to parse the response.");
		} else if (error instanceof FetchErrors) {
			message.error(error.message);
		} else {
			console.log(error);
			message.error("Unkown fetch error.");
		}
	}
	message.channel.stopTyping();
}
