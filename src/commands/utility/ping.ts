import { MessageEmbed } from "discord.js";
import { embedColor } from "../../utils/config";

module.exports = {
	name: "ping",
	description: "Ping!",
	execute(message) {
		const embed = new MessageEmbed({
			title: "Ping",
			description: "Pinging...",
			color: embedColor,
		});

		let ping: number;

		message.channel.send(embed).then((msg) => {
			ping = msg.createdTimestamp - message.createdTimestamp;
			const color = ping < 250 ? "#00ff00" : ping > 250 && ping < 500 ? "#ffaa00" : "#ff0000";

			embed
				.setDescription(
					`**Message Latency** (\`${Math.round(ping)}ms\`)
				**Bot Ping** (\`${Math.round(message.client.ws.ping)}ms\`)`
				)
				.setColor(color);

			msg.edit(embed).then((msg) => msg.delete({ timeout: 15 * 1000 }));
		});

		if (!message.deleted)
			message.delete().catch(() => {
				/*  */
			});
	},
	type: 0,
} as Command;
