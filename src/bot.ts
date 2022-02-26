import { ZeroTwo } from "./classes/ZeroTwo.js";

const bot = new ZeroTwo();

try {
	await bot.login();
} catch (e) {
	bot.logger.error(e);
	await bot.destroy();
	process.exit(1);
}

const handleExit = async () => {
	bot.logger.log("Recieved exit signal to destroy");
	await bot.destroy();
	process.exit(0);
};

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);
