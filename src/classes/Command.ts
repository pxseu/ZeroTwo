import {
	type AutocompleteInteraction,
	type ButtonInteraction,
	type Client,
	Collection,
	type CommandInteraction,
	type CommandInteractionOption,
	type MessageButton,
} from "discord.js";
import { objectify } from "../utils/objectify.js";

export enum CommandType {
	CHAT_INPUT = 1,
	USER = 2,
	MESSAGE = 3,
}

export interface Argument extends CommandInteractionOption {}

// @ts-expect-error
export interface ArgumentDefinition extends Argument {
	description: string;
	type: OptionTypes;
	required?: boolean;
	autocomplete?: boolean;
	options?: ArgumentDefinition[];
	min_value?: number;
	max_value?: number;
	choices?: (string | number)[];
}

export enum OptionTypes {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
	ATTACHMENT = 11,
}

export enum Context {
	GUILD = 0,
	BOT = 1,
	DM = 2,
}

export enum IntegrationType {
	GUILD_INSTALL = 0,
	USER_INSTALL = 1,
}

export abstract class BaseCommand {
	constructor(client: Client) {
		Object.defineProperty(this, "client", { value: client });
	}

	public abstract description: string;
	public abstract type: CommandType | OptionTypes;
	public contexts?: Context[];
	public integrationTypes?: IntegrationType[];
	public options: ArgumentDefinition[] = [];
	public subCommands: Collection<string, SubCommand> = new Collection();
	public buttonInteractions: Collection<string, ButtonCommand> = new Collection();
	public ephermal: boolean | ((...args: Parameters<typeof this.execute>) => boolean) = false;

	public get name(): string {
		return this.constructor.name.toLowerCase();
	}

	public buttonsWithState(author: string, state?: string) {
		return Array.from(this.buttonInteractions.values()).map((b) => ({
			...b.metadata,
			customId: this.client._zerotwo.handy.addState(b.metadata.customId, author, state),
		}));
	}

	public toJSON(): Record<string, unknown> {
		const definition = {
			name: this.name,
			type: this.type,
			description: this.description,
			options: this.options,
		};

		if (this instanceof SubCommand) return objectify(definition);

		return objectify({
			...definition,
			contexts: this.contexts || [Context.GUILD, Context.DM, Context.BOT],
			integration_types: this.integrationTypes || [
				IntegrationType.GUILD_INSTALL,
				IntegrationType.USER_INSTALL,
			],
		});
	}

	public async execute(
		interaction: CommandInteraction | ButtonInteraction,
		_args?: readonly CommandInteractionOption[],
	): Promise<unknown> {
		return interaction.editReply({
			embeds: [this.client._zerotwo.embed({ description: "Sub command not found" })],
		});
	}

	public async autocomplete(
		interaction: AutocompleteInteraction,
		_args?: readonly CommandInteractionOption[],
	): Promise<void> {
		await interaction.respond([]);
	}
}

export interface BaseCommand {
	client: Client;
}

export abstract class Command extends BaseCommand {
	public type = CommandType.CHAT_INPUT;
	public subCommands: Collection<string, SubCommand> = new Collection();
	public options: ArgumentDefinition[] = [];
}

export abstract class SubCommand extends BaseCommand {
	public get type(): OptionTypes {
		return this.subCommands.size > 0 ? OptionTypes.SUB_COMMAND_GROUP : OptionTypes.SUB_COMMAND;
	}
}

export abstract class ButtonCommand {
	constructor(parent: BaseCommand) {
		Object.defineProperty(this, "client", { value: parent.client });
		Object.defineProperty(this, "parent", { value: parent });
	}

	public update = true;
	public abstract metadata: MessageButton;
	public async execute(interaction: ButtonInteraction): Promise<unknown> {
		return this.parent.execute(interaction);
	}
}

export interface ButtonCommand {
	readonly client: Client;
	readonly parent: BaseCommand;
}
