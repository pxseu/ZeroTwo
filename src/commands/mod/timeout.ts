import { CommandInteraction, CommandInteractionOption, GuildMember } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class ModTimeout extends SubCommand {
	public name = "timeout";
	public description = "Timeout a member";
	public options: ArgumentDefinition[] = [
		{
			name: "member",
			description: "The id of the member you want to kick",
			type: OptionTypes.STRING,
			required: true,
		},
		{
			name: "time",
			description: "The time in seconds you want to timeout the member",
			type: OptionTypes.NUMBER,
			required: true,
		},
		{
			name: "reason",
			description: "The reason for the kick",
			type: OptionTypes.STRING,
		},
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		const author = interaction.member as GuildMember;

		if (!interaction.guild?.id)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You need to be in a guild to use this command",
						color: this.client._zerotwo.colors.toNumber(this.client._zerotwo.colors.red),
					}),
				],
			});

		if (!author.permissions.has("MODERATE_MEMBERS", true))
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You need to have the `MODERATE_MEMBERS` permission to use this command",
						color: this.client._zerotwo.colors.toNumber(this.client._zerotwo.colors.red),
					}),
				],
			});

		const memberId = args?.find((arg) => arg.name === this.options[0].name)?.value as string;
		const time = args?.find((arg) => arg.name === this.options[2].name)?.value as number;
		const reason = args?.find((arg) => arg.name === this.options[2].name)?.value as string;

		const member = await this.client._zerotwo.handy.getMember(interaction.guild.id, memberId);

		if (!member)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Member not found",
						color: this.client._zerotwo.colors.toNumber(this.client._zerotwo.colors.red),
					}),
				],
			});

		if (!member.moderatable || !member.manageable)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "I dont have the permissions to timeout this member",
						color: this.client._zerotwo.colors.toNumber(this.client._zerotwo.colors.red),
					}),
				],
			});

		await member.disableCommunicationUntil(time * 1000 + Date.now(), reason);

		await interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					description: `\`${member.user.tag}\` was timed out`,
				}),
			],
		});
	}
}
