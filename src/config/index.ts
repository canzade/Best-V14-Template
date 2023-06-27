import { db } from "./database";
import { env } from "./env";

const isDev = "development" == env.NODE_ENV;

export const config = {
	owners: ["SAHIP_ID_1", "SAHIP_ID_2", "..."],
	env,
	isDev,
	shardCount: (isDev ? 1 : "auto") as number | "auto",
	db,
};
