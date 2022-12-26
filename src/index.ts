import { ShardingManager } from "discord.js";
import { DEV, DISCORD_TOKEN } from "./utils/config.js";
import { logging as logging } from "./utils/log.js";

const logger = logging("SHARDING_MANAGER");

// shard the bot
const manager = new ShardingManager("./dist/bot.js", {
	execArgv: ["--trace-warnings"],
	totalShards: DEV ? 1 : "auto",
	token: DISCORD_TOKEN,
	respawn: true,
});

// on shard ready message the shard id
manager.on("shardCreate", (shard) => {
	logger.log("Launched shard", shard.id);

	shard.on("reconnecting", () => {
		logger.log("Reconnecting shard", shard.id);
	});

	shard.on("disconnect", () => {
		logger.warn("Shard", shard.id, "disconnected");
	});

	shard.on("error", (error) => {
		logger.error("Shard", shard.id, "errored with error:", error);
	});

	shard.on("death", (event) => {
		logger.warn("Shard", shard.id, "died with event", event);
	});
});

// listen to the messages from the shards
const spawned = await manager.spawn();

logger.log("Spawned", spawned.size, "shard(s)");

const handleExit = () => {
	manager.removeAllListeners();

	for (const [, shard] of spawned) {
		shard.removeAllListeners();
		shard.kill();
	}

	logger.log("Exiting");
	process.exit(0);
};

process.on("SIGTERM", handleExit);
process.on("SIGINT", handleExit);
