import { Innertube, YTNodes } from "youtubei.js";

const VIDEO_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set([
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com",
	"music.youtube.com",
]);

export interface YouTubeTrack {
	id: string;
	title: string;
	author: string;
	duration: number;
	durationText: string;
	thumbnail?: string;
	url: string;
}

let client: Promise<Innertube> | undefined;

const getClient = () => {
	client ??= Innertube.create();
	return client;
};

export function getYouTubeVideoId(input: string): string | null {
	const value = input.trim();
	if (VIDEO_ID.test(value)) return value;

	try {
		const url = new URL(value);
		const host = url.hostname.toLowerCase();
		let id: string | null = null;

		if (host === "youtu.be") {
			id = url.pathname.split("/").filter(Boolean)[0] ?? null;
		} else if (YOUTUBE_HOSTS.has(host)) {
			if (url.pathname === "/watch") {
				id = url.searchParams.get("v");
			} else {
				const [kind, candidate] = url.pathname.split("/").filter(Boolean);
				if (kind === "shorts" || kind === "live" || kind === "embed") id = candidate ?? null;
			}
		}

		return id && VIDEO_ID.test(id) ? id : null;
	} catch {
		return null;
	}
}

export function isUrl(input: string): boolean {
	try {
		new URL(input.trim());
		return true;
	} catch {
		return false;
	}
}

export async function searchYouTube(query: string, limit = 5): Promise<YouTubeTrack[]> {
	const results = await (await getClient()).search(query, { type: "video" });

	return results.results
		.filterType(YTNodes.Video)
		.filter((video) => !video.is_live && !video.is_upcoming)
		.slice(0, limit)
		.map((video) => ({
			id: video.video_id,
			title: video.title.toString(),
			author: video.author.name,
			duration: video.duration.seconds,
			durationText: video.duration.text ?? "Unknown length",
			thumbnail: video.best_thumbnail?.url,
			url: `https://www.youtube.com/watch?v=${video.video_id}`,
		}));
}

export async function getYouTubeTrack(id: string): Promise<YouTubeTrack> {
	const info = await (await getClient()).getBasicInfo(id);
	const title = info.basic_info.title;

	if (!title) throw new Error("YouTube did not return metadata for that video");

	const duration = info.basic_info.duration ?? 0;

	return {
		id,
		title,
		author: info.basic_info.author ?? "Unknown channel",
		duration,
		durationText: formatDuration(duration),
		thumbnail: info.basic_info.thumbnail?.at(-1)?.url,
		url: `https://www.youtube.com/watch?v=${id}`,
	};
}

export function formatDuration(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds <= 0) return "Unknown length";

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remaining = Math.floor(seconds % 60);

	return hours > 0
		? `${hours}:${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`
		: `${minutes}:${remaining.toString().padStart(2, "0")}`;
}
