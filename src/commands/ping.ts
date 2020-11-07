import { MessageEmbed, Message } from "discord.js";

module.exports = {
	name: "ping",
	description: "Ping!",
	execute(message: Message, args: [string]) {
		const embed = new MessageEmbed({
			title: "Ping",
			description: "Pinging...",
		});

		let ping: number;

		message.channel.send(embed).then((msg) => {
			ping = msg.createdTimestamp - message.createdTimestamp;
			let color =
				ping < 250
					? "#00ff00"
					: ping > 250 && ping < 500
					? "#ffaa00"
					: "#ff0000";

			embed
				.setDescription(
					`**You** > **Discord** (\`\`${Math.floor(ping)}ms\`\`)
				**We** > **Discord API** (\`\`${Math.floor(message.client.ws.ping)}ms\`\`)`,
				)
				.setColor(color);

			msg.edit(embed).then((msg) => msg.delete({ timeout: 15 * 1000 }));
		});

		if (!message.deleted) message.delete();
	},
	type: 0,
};
