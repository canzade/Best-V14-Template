import { Logger } from "@hammerhq/logger";
import {
	Client,
	Collection,
	GatewayIntentBits,
	Partials,
	REST,
	Routes,
} from "discord.js";
import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "../config";
import { cache, i18n } from "../globals";
import { IHammerCommand, IHammerEvent, IHammerEvents } from "../types";
import { ZHammerCommand, ZHammerEvent } from "../zod";
import { Database } from "./database";
import { utils } from "./utils";

export class Hammer extends Client {
	public logger = new Logger("[Hammer]:");
	public config = config;
	public commands = new Collection<string, IHammerCommand>();
	public i18n = i18n;
	public utils = utils;
	public rest = new REST({ version: "10" }).setToken(config.env.BOT_TOKEN);
	public db = new Database();
	public cache = cache;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.AutoModerationConfiguration,
				GatewayIntentBits.AutoModerationExecution,
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildInvites,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildScheduledEvents,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
			],
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.Message,
				Partials.Reaction,
				Partials.User,
				Partials.GuildScheduledEvent,
				Partials.ThreadMember,
			],
		});
	}

	public listen<K extends keyof IHammerEvents>(
		once: boolean,
		event: K,
		callback: (...args: IHammerEvents[K]) => any,
	): Hammer {
		this[once ? "once" : "on"](event as any, callback);

		return this;
	}

	public emitCustom<K extends keyof IHammerEvents>(
		event: K,
		...args: IHammerEvents[K]
	): boolean {
		return this.emit(event as any, ...args);
	}

	private async handleEvents() {
		const events = readdirSync(resolve(__dirname, "..", "events"));
		for (const event of events) {
			if (
				statSync(
					resolve(__dirname, "..", "events", event),
				).isDirectory()
			)
				continue;

			this.logger.event(
				`Loading event ${resolve(__dirname, "..", "events", event)}...`,
			);

			const eventFile = (
				await import(resolve(__dirname, "..", "events", event))
			).default as IHammerEvent<keyof IHammerEvents>;

			const parseResult = ZHammerEvent.safeParse(eventFile);

			if (false == parseResult.success) {
				this.logger.error(
					`Event ${resolve(
						__dirname,
						"..",
						"events",
						event,
					)} failed to load: ${parseResult.error.message}`,
				);

				continue;
			}

			this.listen(
				parseResult.data.once ?? false,
				parseResult.data.name as keyof IHammerEvents,
				async (...args) => {
					try {
						const success = await eventFile.execute({
							hammer: this,
							args,
						});

						if (false == success) {
							this.logger.error(
								`Event ${parseResult.data.name} failed to execute`,
							);
						}
					} catch (error) {
						parseResult.data.logger.error(error);
					}
				},
			);

			delete require.cache[
				require.resolve(resolve(__dirname, "..", "events", event))
			];

			this.logger.info(`Event ${parseResult.data.name} loaded!`);
		}
	}

	private async handleCommands() {
		const categories = readdirSync(resolve(__dirname, "..", "commands"));
		for (const category of categories) {
			if (
				!statSync(
					resolve(__dirname, "..", "commands", category),
				).isDirectory()
			)
				continue;

			const commands = readdirSync(
				resolve(__dirname, "..", "commands", category),
			);
			for (const command of commands) {
				if (
					statSync(
						resolve(__dirname, "..", "commands", category, command),
					).isDirectory()
				)
					continue;

				this.logger.event(
					`Loading command ${resolve(
						__dirname,
						"..",
						"commands",
						category,
						command,
					)}...`,
				);

				const commandFile = (
					await import(
						resolve(__dirname, "..", "commands", category, command)
					)
				).default as IHammerCommand;

				delete require.cache[
					require.resolve(
						resolve(__dirname, "..", "commands", category, command),
					)
				];

				const parseResult = ZHammerCommand.safeParse(commandFile);

				if (false == parseResult.success) {
					this.logger.error(
						`Command ${resolve(
							__dirname,
							"..",
							"commands",
							category,
							command,
						)} failed to load: ${parseResult.error.message}`,
					);

					continue;
				}

				this.utils.checkAndAddSilentOption(commandFile.builder);

				this.commands.set(parseResult.data.builder.name, commandFile);

				this.logger.info(
					`Command ${parseResult.data.builder.name} loaded!`,
				);
			}
		}

		if (process.argv.includes("--post-commands")) {
			this.logger.event("Posting commands...");
			await this.postCommands();
			this.logger.info("Commands posted!");
		}
	}

	private async postCommands() {
		const body = this.commands
			.toJSON()
			.map((command) => command.builder.toJSON());

		await this.rest.put(
			Routes.applicationCommands(this.config.env.BOT_ID),
			{
				body,
			},
		);
	}

	public async start() {
		await this.db.init();

		this.logger.event("Loading events...");
		await this.handleEvents();
		this.logger.info("Events loaded!");

		this.logger.event("Loading commands...");
		await this.handleCommands();
		this.logger.info("Commands loaded!");

		this.logger.event("Connecting to Discord API...");
		await this.login(this.config.env.BOT_TOKEN);
		this.logger.info(`Connected to Discord API!`);
	}
}
