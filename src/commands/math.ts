import { evaluate } from "mathjs";
import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { ArgumentDefinition, Command, OptionTypes } from "../classes/Command.js";

export default class Math extends Command {
	public description = "Solves a math equation";
	public options: ArgumentDefinition[] = [
		{ name: "equation", description: "The equation that will be solved", type: OptionTypes.STRING, required: true },
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		const equation = args?.find((arg) => arg.name === this.options[0].name)?.value as string;

		if (!equation)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: `You need to specify a \`${this.options[0].name}\``,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		try {
			const response = await evaluate(equation);
			interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: `\`\`\`js\n${response}\n\`\`\``,
					}),
				],
			});
		} catch (e) {
			interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Failed to calculate",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});
		}
	}
}
