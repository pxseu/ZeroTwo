import { MessageEmbed, Message } from "discord.js";

module.exports = {
	name: "owner",
	description: "Owner!",
	execute(message: Message, args: string[]) {
		const embed = new MessageEmbed();
		embed.setDescription(
			`My owner is \`\`pxseu#0001\`\` (338718840873811979)\n[My owners website](https://www.pxseu.com)`,
		);
		message.channel.send(embed);
	},
	type: 0,
	aliases: ["daddy", "mybigboi"],
};
