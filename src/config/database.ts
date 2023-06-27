import { resolve } from "node:path";
import { SequelizeOptions } from "sequelize-typescript";
import { env } from "./env";

export const db: SequelizeOptions = {
	dialect: "sqlite",
	storage: resolve(process.cwd(), env.DB_FILE),
	database: env.DB_NAME,
};
