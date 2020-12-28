import { MessageEmbed } from "discord.js";
import { embedColorInfo } from "../utils/config";

module.exports = {
	name: "owner",
	description: "Owner!",
	execute(message) {
		const embed = new MessageEmbed();
		embed.setColor(embedColorInfo);
		embed.setDescription(
			`My owner is \`\`pxseu#0001\`\` (338718840873811979)\n[My owners website](https://www.pxseu.com)`
		);
		message.channel.send(embed);
	},
	type: 0,
	aliases: ["daddy", "mybigboi"], //ngl this kinda cringe
} as Command;
