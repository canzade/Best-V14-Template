import { Logger } from "@hammerhq/logger";
import { ActivityType } from "discord.js";
import { IHammerEvent } from "../types";

const event: IHammerEvent<"ready"> = {
	logger: new Logger("[HammerEventReady]:"),
	name: "ready",
	once: true,
	async execute({ hammer }) {
		try {
			hammer.user?.setPresence({
				status: "online",
				activities: [
					{
						name: "barbarbar338'in komutlarını",
						type: ActivityType.Listening,
					},
				],
			});

			hammer.logger.success("I'm ready! 🚀");

			return true;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default event;
