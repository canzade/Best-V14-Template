import { Logger } from "@hammerhq/logger";
import { SlashCommandBuilder } from "discord.js";
import { z } from "zod";

export const ZHammerEvent = z.object({
	logger: z.instanceof(Logger),
	name: z.string(),
	once: z.boolean().optional(),
	execute: z.function(),
});

export const ZHammerCommand = z.object({
	logger: z.instanceof(Logger),
	builder: z.instanceof(SlashCommandBuilder),
	cooldown: z.number(),
	execute: z.function(),
	ownerOnly: z.boolean().optional(),
	userModel: z.any(),
	autoComplete: z.function().optional(),
});
