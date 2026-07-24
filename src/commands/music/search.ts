import type {
	AutocompleteInteraction,
	CommandInteraction,
	CommandInteractionOption,
	GuildMember,
} from "discord.js";
import { type ArgumentDefinition, OptionTypes, SubCommand } from "../../classes/Command.js";
import type { EnqueueResult } from "../../classes/Music.js";
import {
	type YouTubeTrack,
	getYouTubeTrack,
	getYouTubeVideoId,
	isUrl,
	searchYouTube,
} from "../../utils/youtube.js";

const QUERY_OPTION = "query";
const SEARCH_TIMEOUT = 2_500;
const MAX_CHOICE_LENGTH = 100;

export default class Search extends SubCommand {
	public description = "Search YouTube or paste a YouTube link";
	public options: ArgumentDefinition[] = [
		{
			name: QUERY_OPTION,
			description: "A song name or YouTube link",
			type: OptionTypes.STRING,
			required: true,
			autocomplete: true,
		},
	];

	public async autocomplete(
		interaction: AutocompleteInteraction,
		args: readonly CommandInteractionOption[] = [],
	): Promise<void> {
		const query = String(args.find((arg) => arg.name === QUERY_OPTION)?.value ?? "").trim();
		if (query.length < 2) return interaction.respond([]);

		const videoId = getYouTubeVideoId(query);
		if (videoId) {
			await interaction.respond([{ name: "Play this YouTube link", value: query.slice(0, 100) }]);
			return;
		}

		if (isUrl(query)) return interaction.respond([]);

		const results = await Promise.race([
			searchYouTube(query),
			new Promise<YouTubeTrack[]>((resolve) => setTimeout(() => resolve([]), SEARCH_TIMEOUT)),
		]);

		await interaction.respond(
			results.map((track) => ({
				name: truncate(`${track.title} — ${track.author} [${track.durationText}]`),
				value: track.url,
			})),
		);
	}

	public async execute(
		interaction: CommandInteraction,
		args: readonly CommandInteractionOption[] = [],
	) {
		if (!interaction.inGuild()) return this.error(interaction, "Music only works in a server.");

		const member = interaction.member as GuildMember;
		const voiceChannel = member.voice.channel;
		if (!voiceChannel) {
			return this.error(interaction, "Join a voice channel first, senpai.");
		}
		if (!voiceChannel.joinable) {
			return this.error(interaction, "I cannot join your voice channel.");
		}
		if (voiceChannel.type === "GUILD_STAGE_VOICE") {
			return this.error(interaction, "Stage channels are not supported yet.");
		}
		if (!voiceChannel.speakable) {
			return this.error(interaction, "I cannot speak in your voice channel.");
		}

		const query = String(args.find((arg) => arg.name === QUERY_OPTION)?.value ?? "").trim();
		if (!query) return this.error(interaction, "Give me a song name or YouTube link.");

		let track: YouTubeTrack;
		const videoId = getYouTubeVideoId(query);

		if (videoId) {
			track = await getYouTubeTrack(videoId);
		} else {
			if (isUrl(query)) {
				return this.error(interaction, "That is not a supported YouTube video link.");
			}

			const [result] = await searchYouTube(query, 1);
			if (!result) return this.error(interaction, `No YouTube results found for \`${query}\`.`);
			track = result;
		}

		let result: EnqueueResult;
		try {
			result = await this.client._zerotwo.music.enqueue(voiceChannel, {
				...track,
				requestedBy: interaction.user.id,
			});
		} catch (error) {
			this.client._zerotwo.logger.error(`Could not queue YouTube video '${track.id}'`, error);
			const message = error instanceof Error ? error.message : String(error);
			return this.error(interaction, `Could not start playback: ${message.slice(0, 500)}`);
		}

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					title: result.started ? "Now playing" : "Added to queue",
					description: `[${track.title}](${track.url})`,
					thumbnail: track.thumbnail ? { url: track.thumbnail } : undefined,
					fields: [
						{ name: "Channel", value: track.author, inline: true },
						{ name: "Duration", value: track.durationText, inline: true },
						...(result.started
							? []
							: [{ name: "Queue position", value: String(result.position), inline: true }]),
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

function truncate(value: string): string {
	if (value.length <= MAX_CHOICE_LENGTH) return value;
	return `${value.slice(0, MAX_CHOICE_LENGTH - 1)}…`;
}
