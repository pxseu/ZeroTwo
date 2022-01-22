import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command, CommandType } from "../classes/Command.js";

export default class Ping extends Command {
	public name = "ping";
	public type = CommandType.CHAT_INPUT;
	public description = "Pong!";
	public options = null;
	public ephermal = true;

	public async execute(interaction: CommandInteraction) {
		const embed = new MessageEmbed({
			title: "Ping",
			description: "Pinging...",
			color: "#00a0a0",
		});

		const start = Date.now();
		await interaction.editReply({ embeds: [embed] });

		const end = Date.now();
		const ping = end - start;
		const color = ping < 250 ? "#00ff00" : ping > 250 && ping < 500 ? "#ffaa00" : "#ff0000";

		embed.setColor(color);
		embed.setDescription(`**Message Latency** (\`${Math.round(ping)}ms\`)
		**Bot Ping** (\`${Math.round(interaction.client.ws.ping)}ms\`)`);

		await interaction.editReply({ embeds: [embed] });
	}
}
