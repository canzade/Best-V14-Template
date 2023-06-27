import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { i18n } from "../globals";

export const handleMultipleLocalization = (section: string, key: string) => {
	return Object.fromEntries(
		i18n.getLocales().map((locale) => {
			return [locale, i18n.get(locale, section, key)];
		}),
	);
};

export const parseMs = (ms: number) => ({
	days: Math.trunc(ms / 86400000),
	hours: Math.trunc(ms / 3600000) % 24,
	minutes: Math.trunc(ms / 60000) % 60,
	seconds: Math.trunc(ms / 1000) % 60,
	milliseconds: Math.trunc(ms) % 1000,
	microseconds: Math.trunc(ms * 1000) % 1000,
	nanoseconds: Math.trunc(ms * 1e6) % 1000,
});

export const randomIntBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);

export const shuffle = <T>(a: T[]): T[] => {
	const array = Array.from(a);
	for (let i = array.length - 1; 0 < i; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

export const getRandomElement = <T>(array: T[]) =>
	array[(array.length * Math.random()) | 0];

export const checkAndAddSilentOption = (
	builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
) => {
	let hasSubcommands = false;
	for (const option of builder.options) {
		if (option instanceof SlashCommandSubcommandBuilder) {
			hasSubcommands = true;
			checkAndAddSilentOption(option);
		}
	}

	if (!hasSubcommands)
		builder.addBooleanOption((option) =>
			option
				.setName("silent")
				.setDescription(
					"Silent mode. It gives a silent response that no one but you can see.",
				)
				.setNameLocalizations(
					handleMultipleLocalization("options", "silent"),
				)
				.setDescriptionLocalizations(
					handleMultipleLocalization("options", "silent_description"),
				),
		);
};

export const formatNumber = (longNumber: number, defaultDecimal = 2) => {
	let length = longNumber.toString().length;
	length -= length % 3;

	const decimal = Math.pow(10, defaultDecimal);
	const outputNum =
		Math.round((longNumber * decimal) / Math.pow(10, length)) / decimal;

	const short = " kMGTPE"[length / 3];

	return (outputNum + short).trim();
};

export const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}

	return res;
};

export const utils = {
	handleMultipleLocalization,
	parseMs,
	randomIntBetween,
	shuffle,
	getRandomElement,
	checkAndAddSilentOption,
	formatNumber,
	chunk,
};
