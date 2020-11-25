import { Message, MessageEmbed } from "discord.js";
import { client } from "..";

module.exports = {
	name: "showconf",
	description: "show current config",
	execute(message: Message, args: string[], guildConf: { [x: string]: any }) {
		const embed = new MessageEmbed();
		embed.setTitle(`The following are the server's current configuration:`);
		embed.setColor("RANDOM");

		const fields = [
			"serverid",
			"prefix",
			"adminRole",
			"modRole",
			"verification",
			"logging",
			"logchannel",
			"roleafterver",
		];

		let desc = "";
		fields.forEach((key) => {
			desc += `${key}: \`\`${String.fromCharCode(8203)}${clean(
				guildConf[key],
			)}\`\`\n`;
		});
		embed.setDescription(desc);
		message.channel.send(embed);
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
