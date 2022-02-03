import { CommandInteraction, CommandInteractionOption, Util } from "discord.js";
import { ArgumentDefinition, OptionTypes, SubCommand } from "../../classes/Command.js";

export default class BotSay extends SubCommand {
	public name = "say";
	public description = "Say something in the channel";
	public options: ArgumentDefinition[] = [
		{
			name: "text",
			description: "The text to send",
			type: OptionTypes.STRING,
			required: true,
		},
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		const text = args?.find((arg) => arg.name === this.options[0].name)?.value as string;
		const regex = /^i('?|\s+a)m\s+((so+|very|really)\s+)?(stupid|dum+b?)$/gi;

		if (!interaction.inGuild())
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Why would you say that about yourself :(",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		if (regex.test(text.trim())) {
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Why would you say that about yourself :(",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});
		}

		interaction.channel!.send(
			Util.cleanContent(text, interaction.channel!).replaceAll(
				/@(everyone|here)/gi,
				(_, mention) => `@${String.fromCharCode(8203)}${mention}`,
			),
		);
	}
}
