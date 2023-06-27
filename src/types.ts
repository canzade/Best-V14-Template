import { Logger } from "@hammerhq/logger";
import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	ClientEvents,
	SlashCommandBuilder,
} from "discord.js";
import { UserModel } from "./models/user";
import { Hammer } from "./struct/core";

export interface IHammerEvents extends ClientEvents {
	slashCommandExecuted: [interaction: ChatInputCommandInteraction];
	buttonPressed: [interaction: ButtonInteraction];
	autoCompleteRequested: [interaction: AutocompleteInteraction];
}

export interface IHammerEventArgs<K extends keyof IHammerEvents> {
	hammer: Hammer;
	args: IHammerEvents[K];
}

export interface IHammerCommandArgs {
	hammer: Hammer;
	interaction: ChatInputCommandInteraction;
	silent: boolean;
	userModel: UserModel;
}

export interface IHammerAutoCompleteArgs {
	hammer: Hammer;
	interaction: AutocompleteInteraction;
}

export interface IHammerSubEvent<K extends keyof IHammerEvents> {
	logger: Logger;
	execute(args: IHammerEventArgs<K>): Promise<boolean>;
}

export interface IHammerEvent<K extends keyof IHammerEvents>
	extends IHammerSubEvent<K> {
	name: K;
	once?: boolean;
}

export interface IHammerSubCommand {
	logger: Logger;
	execute(args: IHammerCommandArgs): Promise<boolean>;
	autoComplete?: (args: IHammerAutoCompleteArgs) => Promise<boolean>;
}

export interface IHammerCommand extends IHammerSubCommand {
	builder: SlashCommandBuilder;
	cooldown: number;
	ownerOnly?: boolean;
	disabled?: boolean;
}
