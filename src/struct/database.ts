import { Logger } from "@hammerhq/logger";
import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { UserModel } from "../models/user";

export class Database {
	public logger = new Logger("[HammerDatabase]:");
	public sequelize = new Sequelize({
		...config.db,
		models: [UserModel],
		logging: config.isDev ? (sql) => this.logger.debug(sql) : false,
	});

	public async getUserModel(userID: string): Promise<UserModel> {
		const [userModel] = await UserModel.findOrCreate({
			where: {
				userID,
			},
		});

		return userModel;
	}

	public async saveUserModel(userModel: UserModel) {
		await UserModel.upsert(userModel.dataValues);
	}

	public async init() {
		this.logger.event("Initializing database...");

		await this.sequelize.authenticate();
		await this.sequelize.sync();

		this.logger.event("Database initialized.");
	}
}
