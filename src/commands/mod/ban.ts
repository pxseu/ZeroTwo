import { CommandInteraction, CommandInteractionOption, GuildMember, Util } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class Ban extends SubCommand {
	public description = "Bans a member";
	public options: ArgumentDefinition[] = [
		{
			name: "member",
			description: "The id of the member you want to ban",
			type: OptionTypes.STRING,
			required: true,
		},
		{
			name: "reason",
			description: "The reason for the ban",
			type: OptionTypes.STRING,
		},
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		if (!interaction.guild?.id)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You need to be in a guild to use this command",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const author = interaction.member as GuildMember;

		if (!author.permissions.has("BAN_MEMBERS", true))
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You need to have the `BAN_MEMBERS` permission to use this command",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const memberId = args?.find((arg) => arg.name === this.options[0].name)?.value as string;
		const reason = args?.find((arg) => arg.name === this.options[1].name)?.value as string;

		const member = await this.client._zerotwo.handy.getMember(interaction.guild.id, memberId);

		if (!member)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Member not found",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		if (!member.bannable || !member.manageable)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "I dont have the permissions to ban this member",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		await member.ban({ reason });

		await interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					description: `\`${Util.escapeInlineCode(member.user.tag)}\` was banned`,
				}),
			],
		});
	}
}
