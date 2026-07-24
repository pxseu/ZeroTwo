import type { CommandInteraction } from "discord.js";
import { Util } from "discord.js";
import { SubCommand } from "../../classes/Command.js";
import type { QueuedTrack } from "../../classes/Music.js";

const MAX_UPCOMING_LENGTH = 1_000;

export default class Queue extends SubCommand {
	public description = "Show the current music queue";

	public async execute(interaction: CommandInteraction) {
		if (!interaction.inGuild()) return this.error(interaction, "Music only works in a server.");

		const queue = this.client._zerotwo.music.getQueue(interaction.guildId);
		if (!queue.current) return this.error(interaction, "Nothing is playing right now.");

		const upcoming: string[] = [];
		let upcomingLength = 0;

		for (const [index, track] of queue.upcoming.entries()) {
			const line = `${index + 1}. ${formatTrack(track)}`;
			if (upcomingLength + line.length + 1 > MAX_UPCOMING_LENGTH) break;
			upcoming.push(line);
			upcomingLength += line.length + 1;
		}

		const omitted = queue.upcoming.length - upcoming.length;
		if (omitted > 0) upcoming.push(`…and ${omitted} more.`);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					title: "Music queue",
					fields: [
						{ name: "Now playing", value: formatTrack(queue.current) },
						{
							name: `Up next (${queue.upcoming.length})`,
							value: upcoming.join("\n") || "The queue is empty.",
						},
					],
				}),
			],
		});
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

function formatTrack(track: QueuedTrack): string {
	const title = Util.escapeMarkdown(track.title);
	return `[${title}](${track.url}) · \`${track.durationText}\` · <@${track.requestedBy}>`;
}
