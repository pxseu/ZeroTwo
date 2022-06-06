import { CommandInteraction, CommandInteractionOption, GuildMember, Message } from "discord.js";
import { ArgumentDefinition, SubCommand, OptionTypes } from "../../classes/Command.js";

export default class ModClear extends SubCommand {
	public name = "clear";
	public description = "Delete messages in a channel";
	public options: ArgumentDefinition[] = [
		{
			name: "limit",
			description: "Remove message up to this amount",
			type: OptionTypes.INTEGER,
			required: true,
			min_value: 1,
			max_value: 100,
		},
		{
			name: "channel",
			description: "ID of the channel to clear messages from, defaults to current channel",
			type: OptionTypes.STRING,
		},
	];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		if (!interaction.inGuild())
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "This command can only be used in a guild.",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const limit = args?.find((arg) => arg.name === this.options[0].name)?.value as number;
		const channel = args?.find((arg) => arg.name === this.options[1].name)?.value as string;

		if (!(interaction.member as GuildMember).permissions.has("MANAGE_MESSAGES", true))
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You do not have permission to use this command.",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const channelId = channel || interaction.channel?.id;

		const channelInGuild = await this.client._zerotwo.handy.getChannel(interaction.guild!.id, channelId ?? null);

		if (!channelInGuild || !channelInGuild.isText())
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "Could not find the text channel.",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const messages = await channelInGuild.messages.fetch({ limit, before: interaction.id });

		const deleted = await channelInGuild.bulkDelete(messages, true);

		const msg = await interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					description: `Deleted \`${deleted.size}\` messages out of \`${messages.size}\` fetched.`,
				}),
			],
		});

		if (msg instanceof Message)
			setTimeout(async () => {
				await msg.delete().catch();
			}, 5000);
	}
}
