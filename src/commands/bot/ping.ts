import { Collection, CommandInteraction, MessageButton } from "discord.js";
import { ButtonCommand, SubCommand } from "../../classes/Command.js";

export default class BotPing extends SubCommand {
	public name = "ping";
	public description = "Get bots latency andping";

	public buttonInteractions: Collection<string, ButtonCommand> = new Collection<string, ButtonCommand>([
		[
			"reload",
			new (class Reload extends ButtonCommand {
				public metadata = new MessageButton().setStyle("SECONDARY").setLabel("Reload");
			})(this.client, this),
		],
	]);

	public async execute(interaction: CommandInteraction) {
		const embed = this.client._zerotwo.embed({
			title: "Ping",
			description: "Pinging...",
		});

		const start = Date.now();

		await interaction.editReply({ embeds: [embed] });

		const ping = Date.now() - start;
		const color = ping < 250 ? "#00aa00" : ping > 250 && ping < 500 ? "#aa5500" : "#aa0000";

		embed.setColor(color);
		embed.setDescription(`**Message Latency** (\`${Math.round(ping)}ms\`)
		**Bot Ping** (\`${Math.round(interaction.client.ws.ping)}ms\`)`);

		await interaction.editReply({
			embeds: [embed],
			components: [{ type: "ACTION_ROW", components: this.buttonsWithState(interaction.user.id, "") }],
		});
	}
}
