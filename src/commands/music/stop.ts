import type { CommandInteraction, GuildMember } from "discord.js";
import { SubCommand } from "../../classes/Command.js";

export default class Stop extends SubCommand {
	public description = "Stop playback and clear the queue";

	public async execute(interaction: CommandInteraction) {
		if (!interaction.inGuild()) return this.error(interaction, "Music only works in a server.");

		const voiceChannel = (interaction.member as GuildMember).voice.channel;
		if (!voiceChannel) return this.error(interaction, "Join my voice channel first, senpai.");

		try {
			const removed = this.client._zerotwo.music.stop(voiceChannel);

			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						title: "Playback stopped",
						description: `Cleared ${removed} ${removed === 1 ? "track" : "tracks"} and left voice.`,
					}),
				],
			});
		} catch (error) {
			return this.error(
				interaction,
				error instanceof Error ? error.message : "Could not stop playback.",
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
