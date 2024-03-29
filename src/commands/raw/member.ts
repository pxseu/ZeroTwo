import { CommandInteraction } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class Member extends SubCommand {
	public description = "Get member data";
	public options: ArgumentDefinition[] = [
		{
			name: "user",
			description: "The id of the member you want to get data from",
			type: OptionTypes.STRING,
		},
		{ name: "guild", description: "The id of the guild you want to get data from", type: OptionTypes.STRING },
	];

	public async execute(interaction: CommandInteraction) {
		const user = interaction.options.getString("user") || interaction.user.id;
		const guild = interaction.options.getString("guild") || interaction.guild?.id || null;

		const member = await this.client._zerotwo.handy.getMember(guild, user);

		if (!member)
			return interaction.editReply({
				embeds: [this.client._zerotwo.embed({ description: "User not found" })],
			});

		await this.client._zerotwo.handy.embedTooLong(
			interaction,
			this.client._zerotwo.embed({
				title: "Member data",
			}),
			JSON.stringify(member.toJSON(), null, 2),
			"json",
		);
	}
}
