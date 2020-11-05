"use strict";

const vm = require("vm");
const { bypassIds } = require("../utils/config");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "eval",
	description: `Dev Eval (special peeps (${bypassIds.join(", ")}))`,
	async execute(message, args) {
		if (bypassIds.some((id) => id == message.author.id)) {
			try {
				const code = args.join(" ");
				const script = new vm.Script(code);

				const context = {
					h,
					message,
					args,
					kill: process.exit,
					require,
					setInterval,
				};

				vm.createContext(context);
				let evaled = await script.runInContext(context);

				if (typeof evaled !== "string")
					evaled = require("util").inspect(evaled);
				message.channel.send(clean(evaled), { code: "xl" });
			} catch (err) {
				message.channel.send(
					`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``,
				);
			}
		} else {
			const embed = new MessageEmbed();

			embed.setColor("RANDOM");
			embed.setDescription(`Only <@${bypassIds.join(">, <@")}>.`);
		}
	},
	type: 0,
};

function clean(text) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}

function h() {
	return "h";
}
