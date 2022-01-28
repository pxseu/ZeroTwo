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
}

export abstract class BaseCommand {
	constructor(client: Client) {
		Object.defineProperty(this, "client", { value: client });
	}

	public abstract name: string;
	public abstract description: string;
	public abstract type: CommandType | OptionTypes;
	public options: ArgumentDefinition[] = [];
	public subCommands: Collection<string, SubCommand> = new Collection();
	public buttonInteractions: Collection<string, ButtonCommand> = new Collection();
	public ephermal: boolean = false;
	public update: boolean = true;

	public buttonsWithState(author: string, state: string) {
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
		args?: readonly CommandInteractionOption[],
	): Promise<unknown> {
		if (this.subCommands.size <= 0)
			return interaction.editReply({
				embeds: [this.client._zerotwo.embed({ description: "Command has not been implemented yet" })],
			});

		const comandName = args?.[0].name;

		const command = this.subCommands.get(comandName ?? "bruh");

		if (!command)
			return interaction.editReply({
				embeds: [this.client._zerotwo.embed({ description: "Sub command not found" })],
			});

		await command.execute(interaction, args?.[0].options);
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

	public execute(
		interaction: CommandInteraction | ButtonInteraction,
		args?: CommandInteractionOption[],
	): Promise<unknown> {
		return super.execute(interaction, args);
	}
}

export abstract class ButtonCommand {
	constructor(client: Client, parent: BaseCommand) {
		Object.defineProperty(this, "client", { value: client });
		Object.defineProperty(this, "parent", { value: parent });
	}

	public update: boolean = true;
	public abstract metadata: MessageButton;
	public async execute(interaction: ButtonInteraction): Promise<unknown> {
		return this.parent.execute(interaction);
	}
}

export interface ButtonCommand {
	client: Client;
	parent: BaseCommand;
}
