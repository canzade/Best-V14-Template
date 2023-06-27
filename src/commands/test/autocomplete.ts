import { Logger } from "@hammerhq/logger";
import { SlashCommandBuilder } from "discord.js";
import { handleMultipleLocalization } from "../../struct/utils";
import { IHammerCommand } from "../../types";

const command: IHammerCommand = {
	logger: new Logger("[HammerCommandAutoComplete]:"),
	builder: new SlashCommandBuilder()
		.setName("autocomplete")
		.setDescription("Replies with Pong!")
		.setNameLocalizations(
			handleMultipleLocalization("command_names", "autocomplete"),
		)
		.setDescriptionLocalizations(
			handleMultipleLocalization(
				"command_names",
				"autocomplete_description",
			),
		)
		.addStringOption((option) =>
			option
				.setName("color")
				.setDescription("Select a color")
				.setNameLocalizations(
					handleMultipleLocalization("options", "color"),
				)
				.setDescriptionLocalizations(
					handleMultipleLocalization("options", "color_description"),
				)
				.setRequired(true)
				.setAutocomplete(true),
		) as SlashCommandBuilder,
	cooldown: 1000 * 5,
	async autoComplete({ interaction, hammer }) {
		try {
			const colors = ["pink", "blue", "red"];

			const response = colors.map((color) => ({
				name: hammer.i18n.get(interaction.locale, "options", color),
				value: color,
			}));

			await interaction.respond(response);

			return true;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
	async execute({ interaction, hammer, silent }) {
		try {
			const color = interaction.options.getString("color", true);

			interaction.reply({
				content: hammer.i18n.get(
					interaction.locale,
					"commands",
					"color_select",
					{
						color: hammer.i18n.get(
							interaction.locale,
							"options",
							color,
						),
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
