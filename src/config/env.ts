import { config } from "dotenv";
import { cleanEnv, str } from "envalid";

config();

export const env = cleanEnv(process.env, {
	BOT_TOKEN: str({
		desc: "Discord bot token.",
	}),
	BOT_ID: str({
		desc: "Discord bot ID.",
	}),
	NODE_ENV: str({
		desc: "Node environment.",
		default: "development",
		choices: ["development", "production"],
	}),
	DB_NAME: str({
		desc: "SQLite database name.",
	}),
	DB_FILE: str({
		desc: "Database file name",
	}),
});
