import { ZeroTwo } from "./client/Bot.js";
import { DISCORD_TOKEN } from "./config.js";

try {
	await new ZeroTwo().login(DISCORD_TOKEN);
} catch (e) {
	console.error(e);
	process.exit(1);
}
