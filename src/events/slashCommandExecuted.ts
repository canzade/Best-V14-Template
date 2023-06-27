import { Logger } from "@hammerhq/logger";
import { Collection } from "discord.js";
import { IHammerEvent } from "../types";

const event: IHammerEvent<"slashCommandExecuted"> = {
	logger: new Logger("[HammerEventSlashCommandExecuted]:"),
	name: "slashCommandExecuted",
	once: false,
	async execute({ hammer, args: [interaction] }) {
		try {
			const command = hammer.commands.get(interaction.commandName);
			if (!command) return true;

			const silent = !!interaction.options.getBoolean("silent");

			if (
				command.ownerOnly &&
				!hammer.config.owners.includes(interaction.user.id)
			) {
				await interaction.reply({
					content: hammer.i18n.get(
						interaction.locale,
						"commands",
						"owner_only",
					),
					ephemeral: silent,
				});

				return true;
			}

			if (!hammer.config.isDev) {
				const now = Date.now();

				const cooldowns = hammer.cache.cooldowns.get(
					interaction.user.id,
				);

				if (cooldowns && cooldowns.has(command.builder.name)) {
					const cooldown = cooldowns.get(command.builder.name);
					if (cooldown) {
						const remaining = cooldown - now;
						if (0 < remaining) {
							const parsed = hammer.utils.parseMs(remaining);
							await interaction.reply({
								content: hammer.i18n.get(
									interaction.locale,
									"commands",
									"cooldown",
									{
										hours: parsed.hours.toString(),
										minutes: parsed.minutes.toString(),
										seconds: parsed.seconds.toString(),
										milliseconds:
											parsed.milliseconds.toString(),
										endsAt: `<t:${Math.floor(
											now / 1000 + remaining / 1000,
										)}:T>`,
									},
								),
								ephemeral: silent,
							});

							return true;
						} else cooldowns.delete(command.builder.name);
					}
				}

				if (!hammer.cache.cooldowns.has(interaction.user.id)) {
					hammer.cache.cooldowns.set(
						interaction.user.id,
						new Collection<string, number>(),
					);
				}

				const randomCooldown = hammer.utils.randomIntBetween(
					command.cooldown - 1000 * 2,
					command.cooldown + 1000 * 2,
				);

				const cooldownsCollection = hammer.cache.cooldowns.get(
					interaction.user.id,
				);

				cooldownsCollection!.set(
					command.builder.name,
					now + randomCooldown,
				);
			}

			const userModel = await hammer.db.getUserModel(interaction.user.id);

			try {
				const res = await command.execute({
					interaction,
					hammer,
					silent,
					userModel,
				});

				if (false == res)
					await interaction[
						interaction.replied ? "editReply" : "reply"
					]({
						content: hammer.i18n.get(
							interaction.locale,
							"commands",
							"error",
						),
						ephemeral: silent,
					});

				return res;
			} catch (error) {
				command.logger.error(error);

				await interaction[interaction.replied ? "editReply" : "reply"]({
					content: hammer.i18n.get(
						interaction.locale,
						"commands",
						"error",
					),
					ephemeral: silent,
				});

				return false;
			}
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default event;
