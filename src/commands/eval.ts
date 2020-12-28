import vm from "vm";
import { bypassIds, embedColor } from "../utils/config";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";

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
			message.channel.send(clean(evaled), { code: "xl" });
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
	type: 0,
} as Command;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}

function h() {
	return "h";
}
