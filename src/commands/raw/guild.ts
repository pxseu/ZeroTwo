import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class Guild extends SubCommand {
	public description = "Get guild data";
	public options: ArgumentDefinition[] = [
		{
			name: "id",
			description: "The id of the guild you want to get data from (we have to be in it duh)",
			type: OptionTypes.STRING,
		},
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		const id = (args && args[0] && (args[0].value as string)) || interaction.guildId;

		const guild = await this.client._zerotwo.handy.getGuild(id);

		if (!guild)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You prob should be in a guild or provide the id of one",
					}),
				],
			});

		await this.client._zerotwo.handy.embedTooLong(
			interaction,
			this.client._zerotwo.embed({
				title: "Guild data",
			}),
			JSON.stringify(guild.toJSON(), null, 2),
			"json",
		);
	}
}
