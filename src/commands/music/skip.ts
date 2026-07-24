import type { CommandInteraction, GuildMember } from "discord.js";
import { SubCommand } from "../../classes/Command.js";

export default class Skip extends SubCommand {
	public description = "Skip the current track";

	public async execute(interaction: CommandInteraction) {
		if (!interaction.inGuild()) return this.error(interaction, "Music only works in a server.");

		const voiceChannel = (interaction.member as GuildMember).voice.channel;
		if (!voiceChannel) return this.error(interaction, "Join my voice channel first, senpai.");

		try {
			const { skipped, next } = this.client._zerotwo.music.skip(voiceChannel);

			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						title: "Skipped",
						description: `[${skipped.title}](${skipped.url})`,
						fields: next
							? [{ name: "Up next", value: `[${next.title}](${next.url})` }]
							: [{ name: "Up next", value: "Nothing—the queue is empty." }],
					}),
				],
			});
		} catch (error) {
			return this.error(
				interaction,
				error instanceof Error ? error.message : "Could not skip the current track.",
			);
		}
	}

	private error(interaction: CommandInteraction, description: string) {
		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					color: this.client._zerotwo.colors.toNumber("red"),
					description,
				}),
			],
		});
	}
}
