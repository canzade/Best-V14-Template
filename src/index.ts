import { Logger } from "@hammerhq/logger";
import { ShardingManager } from "discord.js";
import { resolve } from "node:path";
import { config } from "./config";

const logger = new Logger("[HammerShardingManager]:");
const manager = new ShardingManager(resolve(__dirname, "hammer.js"), {
	token: config.env.BOT_TOKEN,
	respawn: true,
	totalShards: config.shardCount,
});

manager.on("shardCreate", async (shard) => {
	logger.info(
		`Shard ${shard.id} created. [${shard.id + 1}/${manager.totalShards}]`,
	);
});

async function main() {
	logger.event(`Starting ${config.shardCount} shards...`);

	await manager.spawn().catch(logger.error);

	logger.info("All shards started.");
}

main();

process.on("SIGINT", () => {
	logger.warning("Shutting down...");

	manager.broadcastEval((client) => client.destroy()).catch(logger.error);

	process.exit();
});
