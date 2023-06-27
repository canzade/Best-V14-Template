import { I18n } from "@hammerhq/localization";
import { Collection } from "discord.js";
import { resolve } from "node:path";

export const i18n = new I18n({
	defaultLocale: "en-US",
	directory: resolve(process.cwd(), "locales"),
});

export const cache = {
	cooldowns: new Collection<string, Collection<string, number>>(),
};
