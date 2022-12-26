import { CommandInteraction, CommandInteractionOption, GuildMember, Util } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class Kick extends SubCommand {
	public description = "Kicks a member";
	public options: ArgumentDefinition[] = [
		{
			name: "member",
			description: "The id of the member you want to kick",
			type: OptionTypes.STRING,
			required: true,
		},
		{
			name: "reason",
			description: "The reason for the kick",
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

		if (!author.permissions.has("KICK_MEMBERS", true))
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You need to have the `KICK_MEMBERS` permission to use this command",
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

		if (!member.kickable || !member.manageable)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "I dont have the permissions to kick this member",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		await member.kick(reason);

		await interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					description: `\`${Util.escapeInlineCode(member.user.tag)}\` was kicked`,
				}),
			],
		});
	}
}
