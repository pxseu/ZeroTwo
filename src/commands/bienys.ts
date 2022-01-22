import { CommandInteraction } from "discord.js";
import { Command, CommandType } from "../classes/Command.js";

export default class Bienys extends Command {
	public name = "bienys";
	public type = CommandType.CHAT_INPUT;
	public description = "KysBienys";
	public options = null;

	public async execute(interaction: CommandInteraction) {
		await interaction.editReply({
			embeds: [this.client._zerotwo.embed({ description: "kys bienys pies" })],
		});
	}
}
