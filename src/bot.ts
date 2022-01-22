import { ZeroTwo } from "./classes/ZeroTwo.js";

const bot = new ZeroTwo();

try {
	await bot.login();
} catch (e) {
	bot.logger.error(e);
	await bot.destroy();
	process.exit(1);
}

process.on("SIGINT", async () => {
	await bot.destroy();
	process.exit(0);
});
