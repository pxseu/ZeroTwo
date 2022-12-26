import { ButtonInteraction, Collection, CommandInteraction, GuildMember, MessageButton, User } from "discord.js";
import { SubCommand, ButtonCommand } from "../../classes/Command.js";

export default class Avatar extends SubCommand {
	public description = "Get users avatar";

	public buttonInteractions: Collection<string, ButtonCommand> = new Collection([
		[
			"guild",
			new (class PfpGuild extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Guild");
			})(this),
		],
		[
			"global",
			new (class PfpGlobal extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Global");
			})(this),
		],
		[
			"default",
			new (class PfpDefault extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Default");
			})(this),
		],
	]);

	public async execute(interaction: CommandInteraction | ButtonInteraction) {
		if (!interaction.isButton()) return this.guildAvatar(interaction, interaction.member as GuildMember);

		const meta = this.client._zerotwo.handy.getMeta(interaction.customId);

		if (meta?.author !== "" && meta?.author !== interaction.user.id) return interaction.editReply({});

		switch (meta.button) {
			case "guild":
				return this.guildAvatar(interaction, interaction.member as GuildMember);

			case "default":
				return this.defaultAvatar(interaction, interaction.user);

			case "global":
			default:
				return this.globalAvatar(interaction, interaction.user);
		}
	}

	private async guildAvatar(interaction: CommandInteraction | ButtonInteraction, member: GuildMember | null) {
		const url = member?.avatarURL({ format: "png", size: 256, dynamic: true });
		const link = member?.avatarURL({ format: "png", size: 4096, dynamic: true });

		if (!url || !link) return this.globalAvatar(interaction, interaction.user);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: member?.displayName ?? interaction.user.username,
						icon_url: url,
					},
					description: `Guild avatar: [Image Url](${link})`,
					image: {
						url,
					},
				}),
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						...this.buttonsWithState(interaction.user.id, ""),
						new MessageButton().setStyle("LINK").setLabel("Open").setURL(link),
					],
				},
			],
		});
	}

	private async globalAvatar(interaction: CommandInteraction | ButtonInteraction, user: User) {
		const url = user.avatarURL({ format: "png", size: 256, dynamic: true });
		const link = user.avatarURL({ format: "png", size: 4096, dynamic: true });

		if (!url || !link) return this.defaultAvatar(interaction, user);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: interaction.user.username,
						icon_url: url,
					},
					description: `Global avatar: [Image Url](${link})`,
					image: {
						url,
					},
				}),
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						...this.buttonsWithState(interaction.user.id, ""),
						new MessageButton().setStyle("LINK").setLabel("Open").setURL(link),
					],
				},
			],
		});
	}

	private async defaultAvatar(interaction: CommandInteraction | ButtonInteraction, user: User) {
		const link = user.defaultAvatarURL;

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: interaction.user.username,
						icon_url: link,
					},
					description: `Default avatar: [Image Url](${link})`,
					image: {
						url: link,
					},
				}),
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						...this.buttonsWithState(interaction.user.id, ""),
						new MessageButton().setStyle("LINK").setLabel("Open").setURL(link),
					],
				},
			],
		});
	}
}
