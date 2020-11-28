import vm from "vm";
import { bypassIds, embedColor } from "../utils/config";
import { Message, MessageEmbed } from "discord.js";

module.exports = {
	name: "eval",
	description: `Dev Eval (special peeps (${Object.keys(bypassIds).join(
		", ",
	)}))`,
	async execute(message: Message, args: string[]) {
		if (
			Object.keys(bypassIds).some((id) => id == message.author.id) ==
			false
		) {
			const embed = new MessageEmbed();
			embed.setColor(embedColor);
			embed.setDescription(
				`Only <@${Object.keys(bypassIds).join(">, <@")}>.`,
			);
			message.channel.send(embed);
			return;
		}

		try {
			const code = args.join(" ");
			const script = new vm.Script(code);

			const context = {};
			vm.createContext(context);
			let evaled = await script.runInContext(context);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
			message.channel.send(clean(evaled), { code: "xl" });
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	},
	type: 0,
};

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

function peitho() {
	return "cute af omfg aaaaaaaaaaaaaaaa";
	//no u
}
