import { AxiosResponse } from "axios";
import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { ArgumentDefinition, Command, OptionTypes } from "../classes/Command.js";
import { PXSEU_API_URL } from "../utils/config.js";

export default class Pxseu extends Command {
	public name = "pxseu";
	public description = "Send a message to the owners server";
	public options: ArgumentDefinition[] = [
		{ name: "name", description: "The name that will be show on the message", type: OptionTypes.STRING },
		{ name: "message", description: "The message that will be sent", type: OptionTypes.STRING },
		{ name: "attachment", description: "The attachment that will be sent", type: OptionTypes.STRING },
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		const name = args?.find((arg) => arg.name === this.options[0].name)?.value as string;
		const message = args?.find((arg) => arg.name === this.options[1].name)?.value as string;
		const attachment = args?.find((arg) => arg.name === this.options[2].name)?.value as string;

		if (!message && !attachment)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: `You need to specify a \`${this.options[1].name}\` or a \`${this.options[2].name}\``,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const response = (await this.client._zerotwo.axios
			.post(PXSEU_API_URL, {
				name,
				message,
				attachment,
			})
			.catch((err) => err.response)) as AxiosResponse;

		if (response.status !== 200)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: response.data.message ?? response.statusText,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					description: "Message sent",
				}),
			],
		});
	}
}
