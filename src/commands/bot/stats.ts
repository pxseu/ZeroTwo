import { Collection, CommandInteraction, MessageButton } from "discord.js";
import { ButtonCommand, SubCommand } from "../../classes/Command.js";

export default class Dev extends SubCommand {
	public name = "info";
	public description = "Bot stats";
	public options = [];

	public buttonInteractions: Collection<string, ButtonCommand> = new Collection<string, ButtonCommand>([
		[
			"reload",
			new (class Reload extends ButtonCommand {
				public metadata = new MessageButton().setStyle("SECONDARY").setLabel("Reload");
			})(this.client, this),
		],
	]);

	public async execute(interaction: CommandInteraction) {
		const data = await Promise.all([
			this.client.shard!.fetchClientValues("guilds.cache.size"),
			this.client.shard!.fetchClientValues("users.cache.size"),
		] as Promise<number[]>[]);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					title: "Info",
					description: "Some info about the bot",
					fields: [
						{
							name: "NAME",
							value: `\`${this.client.user!.tag}\``,
							inline: true,
						},
						{
							name: "ID",
							value: `\`${this.client.user!.id}\``,
							inline: true,
						},
						{
							name: "CREATED",
							value: `<t:${~~(this.client.user!.createdAt.getTime() / 1000)}:R>`,
							inline: true,
						},
						{
							name: "COMMANDS",
							value: `\`${this.client._zerotwo.commands.size}\``,
							inline: true,
						},
						{
							name: "SHARDS",
							value: `\`${this.client.shard!.count}\``,
							inline: true,
						},
						{
							name: "USERS",
							value: `\`${data[1].reduce((a, b) => a + b, 0)}\``,
							inline: true,
						},
						{
							name: "GUILDS",
							value: `\`${data[0].reduce((a, b) => a + b, 0)}\``,
							inline: true,
						},
						{
							name: "STARTED",
							value: `<t:${~~((Date.now() - process.uptime() * 1000) / 1000)}:R>`,
							inline: true,
						},
						{
							name: "NODE VERSION",
							value: `\`${process.versions.node}\``,
							inline: true,
						},
					],
					thumbnail: {
						url: this.client.user!.avatarURL() ?? this.client.user!.defaultAvatarURL,
					},
				}),
			],
			components: [{ type: "ACTION_ROW", components: this.buttonsWithState(interaction.user.id, "") }],
		});
	}
}
