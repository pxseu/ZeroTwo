import {
	ButtonInteraction,
	Client,
	Collection,
	CommandInteraction,
	CommandInteractionOption,
	MessageButton,
} from "discord.js";
import { objectify } from "../utils/objectify.js";

export enum CommandType {
	CHAT_INPUT = 1,
	USER,
	MESSAGE,
}

export interface Argument extends CommandInteractionOption {}

// @ts-ignore
export interface ArgumentDefinition extends Argument {
	description: string;
	type: OptionTypes;
	required?: boolean;
	options?: ArgumentDefinition[];
	min_value?: number;
	max_value?: number;
	choices?: (string | number)[];
}

export enum OptionTypes {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP,
	STRING,
	INTEGER,
	BOOLEAN,
	USER,
	CHANNEL,
	ROLE,
	MENTIONABLE,
	NUMBER,
	ATTACHMENT,
}

export abstract class BaseCommand {
	constructor(client: Client) {
		Object.defineProperty(this, "client", { value: client });
	}

	public abstract description: string;
	public abstract type: CommandType | OptionTypes;
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

	public toJSON(): Record<string, any> {
		return objectify({
			name: this.name,
			type: this.type,
			description: this.description,
			options: this.options,
		} as any);
	}

	public async execute(
		interaction: CommandInteraction | ButtonInteraction,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_args?: readonly CommandInteractionOption[],
	): Promise<unknown> {
		return interaction.editReply({
			embeds: [this.client._zerotwo.embed({ description: "Sub command not found" })],
		});
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

	public update: boolean = true;
	public abstract metadata: MessageButton;
	public async execute(interaction: ButtonInteraction): Promise<unknown> {
		return this.parent.execute(interaction);
	}
}

export interface ButtonCommand {
	readonly client: Client;
	readonly parent: BaseCommand;
}
