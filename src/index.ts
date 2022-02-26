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
});

// listen to the messages from the shards
const spawned = await manager.spawn();

for (const [id, shard] of spawned) {
	shard.send({ type: "shardId", payload: id });

	shard.on("death", (event) => {
		logger.warn(`Shard ${id} died with event ${event.exitCode}`);
	});

	shard.on("error", (error) => {
		logger.error(`Shard ${id} errored with error:`, error);
	});
}

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
