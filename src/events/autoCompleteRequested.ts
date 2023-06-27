import { Logger } from "@hammerhq/logger";
import { IHammerEvent } from "../types";

const event: IHammerEvent<"autoCompleteRequested"> = {
	logger: new Logger("[HammerEventAutoCompleteRequested]:"),
	name: "autoCompleteRequested",
	once: false,
	async execute({ hammer, args: [interaction] }) {
		try {
			const command = hammer.commands.get(interaction.commandName);
			if (!command) return true;
			if (!command.autoComplete) return true;

			const res = await command.autoComplete({
				hammer,
				interaction,
			});

			if (false == res)
				this.logger.error(
					"Failed to execute autoComplete for",
					command.builder.name,
				);

			return res;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default event;
