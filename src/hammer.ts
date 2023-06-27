import { Hammer } from "./struct/core";

const hammer = new Hammer();

async function main() {
	hammer.logger.event("Starting the bot.");

	await hammer.start();

	hammer.logger.info("Bot started.");
}

main();

process.on("SIGINT", () => {
	hammer.logger.warning("Shutting down...");

	hammer.destroy();
	hammer.db.sequelize.close();

	process.exit();
});
