import { Logger } from "@hammerhq/logger";
import { IHammerEvent } from "../types";

const event: IHammerEvent<"interactionCreate"> = {
	logger: new Logger("[HammerEventInteractionCreate]:"),
	name: "interactionCreate",
	once: false,
	async execute({ hammer, args: [interaction] }) {
		try {
			if (interaction.isChatInputCommand())
				hammer.emitCustom("slashCommandExecuted", interaction);
			if (interaction.isButton())
				hammer.emitCustom("buttonPressed", interaction);
			if (interaction.isAutocomplete())
				hammer.emitCustom("autoCompleteRequested", interaction);

			return true;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default event;
