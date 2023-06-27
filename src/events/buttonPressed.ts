import { Logger } from "@hammerhq/logger";
import { IHammerEvent } from "../types";

const event: IHammerEvent<"buttonPressed"> = {
	logger: new Logger("[HammerEventButtonPressed]:"),
	name: "buttonPressed",
	once: false,
	async execute({ args: [interaction] }) {
		try {
			this.logger.debug("Button pressed", interaction.customId);

			return true;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default event;
