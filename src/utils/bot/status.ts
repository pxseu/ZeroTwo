import { client } from "../..";
import { botStatuses, DEV_MODE } from "../config";
import type { PresenceData } from "discord.js";

export function startStatus(): void {
	const setStatus = (activity: PresenceData["activity"]) => {
		client.user?.setPresence({
			status: "dnd",
			activity,
		});
	};

	if (DEV_MODE) {
		setStatus({ type: "WATCHING", name: "development 🤖" });
		return;
	}

	setStatus({ type: "WATCHING", name: "the bot start! 🛠" });

	let iterator = 0;
	setInterval(() => {
		setStatus(botStatuses[iterator](client));
		iterator = iterator == botStatuses.length - 1 ? 0 : iterator + 1;
	}, 15000);
}
