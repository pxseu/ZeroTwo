import { Client, CommandInteractionOption, Interaction, Message /*, PermissionString */ } from "discord.js";
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

export abstract class Command {
	constructor(client: Client) {
		Object.defineProperty(this, "client", { value: client });
	}

	public abstract name: string;
	public abstract description: string;
	public abstract type: CommandType | CommandType[];
	public abstract options: ArgumentDefinition[] | null;
	public ephermal: boolean = false;

	// public abstract permissions: PermissionString[] | null;
	public abstract execute(
		message: Message | Interaction,
		args: readonly CommandInteractionOption[],
	): Promise<unknown> | unknown;

	public toJSON(): Record<string, any> {
		return objectify({
			name: this.name,
			type: this.type,
			description: this.description,
			options: this.options,
		} as any);
	}
}

export interface Command {
	client: Client;
}
