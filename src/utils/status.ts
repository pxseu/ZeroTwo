import { client } from "../";
import { botStatuses } from "./config";
import type { PresenceData } from "discord.js";

export function startStatus() {
	const setStatus = (activity: PresenceData["activity"]) => {
		client.user.setPresence({
			status: "dnd",
			activity,
		});
	};

	setStatus({ name: "the bot start! 🛠", type: "WATCHING" });

	let iterator = 0;
	setInterval(() => {
		setStatus(botStatuses[iterator]);
		iterator = iterator == botStatuses.length - 1 ? 0 : iterator + 1;
	}, 15000);
}
