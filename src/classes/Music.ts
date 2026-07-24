import { type ChildProcessByStdio, spawn } from "node:child_process";
import type { Readable } from "node:stream";
import {
	type AudioPlayer,
	AudioPlayerStatus,
	type DiscordGatewayAdapterCreator,
	NoSubscriberBehavior,
	type VoiceConnection,
	VoiceConnectionStatus,
	createAudioPlayer,
	createAudioResource,
	demuxProbe,
	entersState,
	joinVoiceChannel,
} from "@discordjs/voice";
import type { Client, VoiceBasedChannel } from "discord.js";
import { MUSIC_DEBUG, YT_DLP_PATH } from "../utils/config.js";
import type { YouTubeTrack } from "../utils/youtube.js";

const DISCONNECT_DELAY = 30_000;

export interface QueuedTrack extends YouTubeTrack {
	requestedBy: string;
}

export interface EnqueueResult {
	started: boolean;
	position: number;
}

export interface QueueSnapshot {
	current: QueuedTrack | null;
	upcoming: QueuedTrack[];
}

export interface SkipResult {
	skipped: QueuedTrack;
	next: QueuedTrack | null;
}

export class Music {
	private readonly sessions = new Map<string, GuildMusicSession>();

	constructor(private readonly client: Client) {}

	public async checkDependencies(): Promise<void> {
		const checks = await Promise.all([
			this.getVersion(YT_DLP_PATH, ["--version"]),
			this.getVersion("ffmpeg", ["-version"]),
		]);

		for (const check of checks) {
			if (check.error) {
				this.client._zerotwo.logger.warn(
					`Music dependency '${check.command}' is unavailable: ${check.error}`,
				);
			} else {
				this.client._zerotwo.logger.log(`Music dependency '${check.command}': ${check.version}`);
			}
		}
	}

	public async enqueue(channel: VoiceBasedChannel, track: QueuedTrack): Promise<EnqueueResult> {
		let session = this.sessions.get(channel.guild.id);

		if (session && session.channelId !== channel.id) {
			throw new Error("I am already playing music in another voice channel");
		}

		if (!session) {
			session = new GuildMusicSession(this.client, channel, () => {
				this.sessions.delete(channel.guild.id);
			});
			this.sessions.set(channel.guild.id, session);
		}

		try {
			return await session.enqueue(track);
		} catch (error) {
			if (session.empty) session.destroy();
			throw error;
		}
	}

	public getQueue(guildId: string): QueueSnapshot {
		const session = this.sessions.get(guildId);
		return session?.snapshot ?? { current: null, upcoming: [] };
	}

	public skip(channel: VoiceBasedChannel): SkipResult {
		return this.getControllableSession(channel).skip();
	}

	public stop(channel: VoiceBasedChannel): number {
		const session = this.getControllableSession(channel);
		const removed = session.size;
		session.destroy();
		return removed;
	}

	public destroy(): void {
		for (const session of this.sessions.values()) session.destroy();
		this.sessions.clear();
	}

	private getControllableSession(channel: VoiceBasedChannel): GuildMusicSession {
		const session = this.sessions.get(channel.guild.id);

		if (!session || session.empty) throw new Error("Nothing is playing right now");
		if (session.channelId !== channel.id) {
			throw new Error("Join my voice channel before controlling playback");
		}

		return session;
	}

	private getVersion(
		command: string,
		args: string[],
	): Promise<{ command: string; version?: string; error?: string }> {
		return new Promise((resolve) => {
			const process = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
			let output = "";
			let error = "";

			process.stdout.setEncoding("utf8");
			process.stderr.setEncoding("utf8");
			process.stdout.on("data", (chunk: string) => {
				output += chunk;
			});
			process.stderr.on("data", (chunk: string) => {
				error += chunk;
			});
			process.once("error", (spawnError) => {
				resolve({ command, error: spawnError.message });
			});
			process.once("close", (code) => {
				if (code === 0) {
					resolve({
						command,
						version: output.trim().split("\n")[0] || "unknown",
					});
				} else {
					resolve({
						command,
						error: error.trim().split("\n")[0] || `exited with status ${code}`,
					});
				}
			});
		});
	}
}

class GuildMusicSession {
	public readonly channelId: string;
	private readonly player: AudioPlayer;
	private readonly connection: VoiceConnection;
	private readonly queue: QueuedTrack[] = [];
	private current: QueuedTrack | null = null;
	private source: ChildProcessByStdio<null, Readable, Readable> | null = null;
	private starting: Promise<void> | null = null;
	private disconnectTimeout: NodeJS.Timeout | null = null;
	private destroyed = false;
	private generation = 0;

	constructor(
		private readonly client: Client,
		channel: VoiceBasedChannel,
		private readonly onDestroy: () => void,
	) {
		this.channelId = channel.id;
		this.client._zerotwo.logger.log(
			`Creating music session for guild '${channel.guild.id}' in voice channel '${channel.id}'`,
		);
		this.player = createAudioPlayer({
			behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
		});
		this.connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
			selfDeaf: true,
			debug: MUSIC_DEBUG,
		});
		this.connection.subscribe(this.player);

		this.player.on("stateChange", (oldState, newState) => {
			this.client._zerotwo.logger.log(
				`Music player in guild '${channel.guild.id}': ${oldState.status} -> ${newState.status}`,
			);
		});

		this.player.on(AudioPlayerStatus.Idle, () => {
			this.stopSource();
			this.current = null;
			this.startNext();
		});

		this.player.on("error", (error) => {
			this.client._zerotwo.logger.error(`Music player error in guild '${channel.guild.id}'`, error);
		});

		this.connection.on(VoiceConnectionStatus.Disconnected, () => {
			this.client._zerotwo.logger.warn(
				`Voice connection disconnected in guild '${channel.guild.id}', attempting recovery`,
			);
			void this.reconnect();
		});

		this.connection.on("stateChange", (oldState, newState) => {
			this.client._zerotwo.logger.log(
				`Voice connection in guild '${channel.guild.id}': ${oldState.status} -> ${newState.status}`,
			);
		});

		if (MUSIC_DEBUG) {
			this.connection.on("debug", (message) => {
				this.client._zerotwo.logger.log(`Voice debug in guild '${channel.guild.id}': ${message}`);
			});
		}
	}

	public get empty(): boolean {
		return !this.current && !this.starting && this.queue.length === 0;
	}

	public get size(): number {
		return this.queue.length + (this.current ? 1 : 0);
	}

	public get snapshot(): QueueSnapshot {
		return {
			current: this.current,
			upcoming: [...this.queue],
		};
	}

	public async enqueue(track: QueuedTrack): Promise<EnqueueResult> {
		if (this.destroyed) throw new Error("The music session has already ended");
		if (this.disconnectTimeout) clearTimeout(this.disconnectTimeout);
		this.disconnectTimeout = null;

		const started = this.empty;
		this.queue.push(track);
		const position = this.queue.length;
		this.client._zerotwo.logger.log(
			`Queued YouTube video '${track.id}' in voice channel '${this.channelId}' at position ${position}`,
		);

		if (started) {
			this.startNext();
			await this.starting;
		}

		return { started, position };
	}

	public skip(): SkipResult {
		if (!this.current) throw new Error("Nothing is playing right now");

		const skipped = this.current;
		const next = this.queue[0] ?? null;

		this.generation += 1;
		this.current = null;
		this.stopSource();

		const stopped = this.player.stop(true);
		if (!stopped && !this.starting) this.startNext();

		return { skipped, next };
	}

	public destroy(): void {
		if (this.destroyed) return;
		this.destroyed = true;
		this.generation += 1;

		if (this.disconnectTimeout) clearTimeout(this.disconnectTimeout);
		this.stopSource();
		this.player.stop(true);
		if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
		this.onDestroy();
	}

	private startNext(): void {
		if (this.destroyed || this.starting || this.current) return;

		const next = this.queue.shift();
		if (!next) {
			this.disconnectTimeout = setTimeout(() => this.destroy(), DISCONNECT_DELAY);
			return;
		}

		this.current = next;
		const generation = ++this.generation;
		this.client._zerotwo.logger.log(
			`Starting YouTube video '${next.id}' in voice channel '${this.channelId}'`,
		);
		this.starting = this.play(next, generation)
			.catch((error) => {
				this.client._zerotwo.logger.error(
					`Failed to play YouTube video '${next.id}' in voice`,
					error,
				);
				this.current = null;
				this.stopSource();
				throw error;
			})
			.finally(() => {
				this.starting = null;
				if (!this.current) this.startNext();
			});
		void this.starting.catch(() => {});
	}

	private async play(track: QueuedTrack, generation: number): Promise<void> {
		await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
		if (this.destroyed || generation !== this.generation) return;
		this.client._zerotwo.logger.log(
			`Voice connection ready for YouTube video '${track.id}' in channel '${this.channelId}'`,
		);

		const source = spawn(
			YT_DLP_PATH,
			[
				"--quiet",
				"--no-warnings",
				"--no-playlist",
				"--format",
				"bestaudio[acodec=opus]/bestaudio",
				"--output",
				"-",
				"--",
				track.url,
			],
			{ stdio: ["ignore", "pipe", "pipe"] },
		);
		this.source = source;
		this.client._zerotwo.logger.log(
			`Spawned yt-dlp for YouTube video '${track.id}' in voice channel '${this.channelId}'`,
		);

		let stderr = "";
		source.stderr.setEncoding("utf8");
		source.stderr.on("data", (chunk: string) => {
			stderr = `${stderr}${chunk}`.slice(-2000);
		});
		source.once("close", (code, signal) => {
			this.client._zerotwo.logger.log(
				`yt-dlp closed for YouTube video '${track.id}' with code '${code}' and signal '${signal}'`,
			);
		});

		const spawnError = new Promise<never>((_, reject) => {
			source.once("error", reject);
			source.once("close", (code) => {
				if (code && code !== 0) {
					reject(new Error(stderr.trim() || `yt-dlp exited with status ${code}`));
				}
			});
		});

		const probe = await Promise.race([demuxProbe(source.stdout), spawnError]);
		this.client._zerotwo.logger.log(
			`Detected '${probe.type}' audio for YouTube video '${track.id}'`,
		);
		if (this.destroyed || generation !== this.generation) {
			source.kill("SIGKILL");
			return;
		}

		this.player.play(
			createAudioResource(probe.stream, {
				inputType: probe.type,
				metadata: track,
			}),
		);
	}

	private stopSource(): void {
		if (this.source && !this.source.killed) this.source.kill("SIGKILL");
		this.source = null;
	}

	private async reconnect(): Promise<void> {
		try {
			await Promise.race([
				entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
				entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
			]);
			this.client._zerotwo.logger.log(
				`Voice connection recovery started in channel '${this.channelId}'`,
			);
		} catch {
			this.client._zerotwo.logger.error(
				`Voice connection recovery failed in channel '${this.channelId}'`,
			);
			this.destroy();
		}
	}
}
