import type { CommandInteraction, CommandInteractionOption } from "discord.js";
import { type ArgumentDefinition, Command, OptionTypes } from "../classes/Command.js";
import { PXSEU_API_URL } from "../utils/config.js";

export default class Pxseu extends Command {
	public description = "Send a message to the owners server";
	public options: ArgumentDefinition[] = [
		{
			name: "name",
			description: "The name that will be show on the message",
			type: OptionTypes.STRING,
		},
		{
			name: "content",
			description: "The message content that will be sent",
			type: OptionTypes.STRING,
		},
		{
			name: "attachment",
			description: "The attachment that will be sent",
			type: OptionTypes.ATTACHMENT,
		},
	];

	public async execute(
		interaction: CommandInteraction,
		args?: readonly CommandInteractionOption[],
	) {
		const name = args?.find((arg) => arg.name === this.options[0].name)?.value as string;
		const message = args?.find((arg) => arg.name === this.options[1].name)?.value as string;
		const attachment = args?.find((arg) => arg.name === this.options[2].name)?.attachment?.url;

		if (!message && !attachment)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: `You need to specify a \`${this.options[1].name}\` or a \`${this.options[2].name}\``,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const response = await this.client._zerotwo.apiFetch(PXSEU_API_URL, {
			method: "POST",
			body: JSON.stringify({ name, message, attachment }),
		});

		if (!response.ok) {
			const data = await response.json().catch(() => null);
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: data?.message ?? response.statusText,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});
		}

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					description: "Message sent",
				}),
			],
		});
	}
}
