import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class RawUser extends SubCommand {
	public name = "user";
	public description = "Get user data";
	public options: ArgumentDefinition[] = [
		{
			name: "id",
			description: "The id of the user you want to get data from",
			type: OptionTypes.STRING,
		},
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		const id = (args && args[0] && (args[0].value as string)) || interaction.user.id;

		const user = await this.client._zerotwo.handy.getUser(id);

		if (!user)
			return interaction.editReply({
				embeds: [this.client._zerotwo.embed({ description: "User not found" })],
			});

		await this.client._zerotwo.handy.embedTooLong(
			interaction,
			this.client._zerotwo.embed({
				title: "User data",
			}),
			JSON.stringify(user.toJSON(), null, 2),
			"json",
		);
	}
}
