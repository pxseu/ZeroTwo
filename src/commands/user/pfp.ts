import { ButtonInteraction, Collection, CommandInteraction, GuildMember, MessageButton, User } from "discord.js";
import { SubCommand, ButtonCommand } from "../../classes/Command.js";

export default class UserPfp extends SubCommand {
	public name = "pfp";
	public description = "Get profile picture of a user";

	public buttonInteractions: Collection<string, ButtonCommand> = new Collection<string, ButtonCommand>([
		[
			"guild",
			new (class PfpGuild extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Guild");
			})(this.client, this),
		],
		[
			"global",
			new (class PfpGlobal extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Global");
			})(this.client, this),
		],
		[
			"default",
			new (class PfpDefault extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Default");
			})(this.client, this),
		],
	]);

	public async execute(interaction: CommandInteraction | ButtonInteraction) {
		if (!interaction.isButton()) return this.guildPfp(interaction, interaction.member as GuildMember);

		const meta = this.client._zerotwo.handy.getMeta(interaction.customId);

		if (meta?.author !== "" && meta?.author !== interaction.user.id)
			return interaction.editReply({
				embeds: interaction.message.embeds,
			});

		switch (meta.button) {
			case "guild":
				return this.guildPfp(interaction, interaction.member as GuildMember);

			case "default":
				return this.defaultPfp(interaction, interaction.user);

			case "global":
			default:
				return this.globalPfp(interaction, interaction.user);
		}
	}

	private async guildPfp(interaction: CommandInteraction | ButtonInteraction, member: GuildMember | null) {
		const url = member?.avatarURL({ format: "png", size: 256, dynamic: true });
		const link = member?.avatarURL({ format: "png", size: 4096, dynamic: true });

		if (!url || !link) return this.globalPfp(interaction, interaction.user);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: member?.displayName ?? interaction.user.username,
						icon_url: url,
					},
					description: `[Image Url](${link})`,
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

	private async globalPfp(interaction: CommandInteraction | ButtonInteraction, user: User) {
		const url = user.avatarURL({ format: "png", size: 256, dynamic: true }) ?? user.defaultAvatarURL;
		const link = user.avatarURL({ format: "png", size: 4096, dynamic: true }) ?? user.defaultAvatarURL;

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: interaction.user.username,
						icon_url: url,
					},
					description: `[Image Url](${link})`,
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

	private async defaultPfp(interaction: CommandInteraction | ButtonInteraction, user: User) {
		const link = user.defaultAvatarURL;

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: interaction.user.username,
						icon_url: link,
					},
					description: `[Image Url](${link})`,
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
