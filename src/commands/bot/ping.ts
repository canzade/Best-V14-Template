import { Logger } from "@hammerhq/logger";
import { SlashCommandBuilder } from "discord.js";
import { handleMultipleLocalization } from "../../struct/utils";
import { IHammerCommand } from "../../types";

const command: IHammerCommand = {
	logger: new Logger("[HammerCommandPing]:"),
	builder: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!")
		.setNameLocalizations(
			handleMultipleLocalization("command_names", "ping"),
		)
		.setDescriptionLocalizations(
			handleMultipleLocalization("command_names", "ping_description"),
		),
	cooldown: 1000 * 10,
	async execute({ interaction, hammer, silent }) {
		try {
			interaction.reply({
				content: hammer.i18n.get(
					interaction.locale,
					"commands",
					"ping",
					{
						ping: hammer.ws.ping.toString(),
					},
				),
				ephemeral: silent,
			});

			return true;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default command;
