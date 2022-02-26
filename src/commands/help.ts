import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { ArgumentDefinition, Command, OptionTypes } from "../classes/Command.js";

export default class Help extends Command {
	public name = "help";
	public description = "Show the help message";
	public options: ArgumentDefinition[] = [
		{ name: "command", description: "The command you want help with", type: OptionTypes.STRING },
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		if (!args?.length)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Commands:",
						fields: this.client._zerotwo.commands.map((command) => ({
							name: `\`${command.name}\``,
							value: command.description,
						})),
					}),
				],
			});

		const command = this.client._zerotwo.commands.find((com) => com.name === args[0].value);

		if (!command)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: `Command \`${args[0].value}\` not found`,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					title: `Command \`${command.name}\` options`,
					description: command.description,
					fields: command.options.map((option) => ({
						name: `\`${option.name}\``,
						value: option.description,
					})),
				}),
			],
		});
	}
}
