import type { Command } from "./classes/Command.js";
import { ZeroTwo } from "./classes/ZeroTwo.js";
import {
	APPLICATION_ID,
	DEV,
	DEV_GUILD,
	DISCORD_BOT_VERSION,
	DISCORD_TOKEN,
} from "./utils/config.js";
import { logging } from "./utils/log.js";

const logger = logging("PUBLISH");

const API_VERSION = 10;

const headers: HeadersInit = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: `Bot ${DISCORD_TOKEN}`,
	"User-Agent": `DiscordBot (+https://github.com/pxseu/zerotwo, ${DISCORD_BOT_VERSION}) ZeroTwo`,
};

const publish = async (commands: Command[], guild?: string): Promise<void> => {
	const url = guild
		? `https://discord.com/api/v${API_VERSION}/applications/${APPLICATION_ID}/guilds/${guild}/commands`
		: `https://discord.com/api/v${API_VERSION}/applications/${APPLICATION_ID}/commands`;

	const oldRes = await fetch(url, { headers });

	if (!oldRes.ok) {
		throw new Error(`Failed to fetch existing commands: ${oldRes.status} ${oldRes.statusText}`);
	}

	const old = (await oldRes.json()) as (Command & { id: string })[];

	const toRemove = old.filter((o) => !commands.some((n) => n.name === o.name));

	if (toRemove.length) {
		await Promise.all(toRemove.map((c) => fetch(`${url}/${c.id}`, { method: "DELETE", headers })));

		logger.log("Removed", toRemove.length, "commands");
	}

	if (commands.length) {
		const putRes = await fetch(url, {
			method: "PUT",
			headers,
			body: JSON.stringify(commands),
		});

		if (!putRes.ok) {
			const body = await putRes.text();
			throw new Error(`Failed to publish commands: ${putRes.status} ${putRes.statusText}\n${body}`);
		}
	}

	logger.log("Published", commands.length, "commands");
};

const bot = await new ZeroTwo().loadCommands();

try {
	const commands = Array.from(bot.commands.values());

	if (DEV && DEV_GUILD) {
		await publish(commands, DEV_GUILD);
	} else {
		await publish(commands);
	}
} catch (e) {
	logger.error(e);
} finally {
	logger.log("Done");
	await bot.destroy();
}
