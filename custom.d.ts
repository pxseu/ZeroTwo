import type { guildConf } from "./src/models/server";
import type { Client } from "discord.js";
import type { botStaff } from "./src/models/botStaff";
import type { Message } from "discord.js";
import type { Player } from "discord-player";
import { User } from "discord.js";

type messageContent =
	| string
	| {
			title?: string;
			text?: string;
			footer?: string;
			thumbnail?: string;
			author?: User;
	  };

declare global {
	type Command = {
		name: string;
		description?: string;
		execute: (message: Message, args: string[]) => void | Promise<void>;
		aliases?: string[];
		type: number;
		cooldown?: number;
		args?: { name: string; desc: string }[];
	};
}
declare module "discord.js" {
	export interface Client {
		commands: Collection<string, Command>;
		player: Player;
	}
	export interface Message {
		guildConf: guildConf;
		staff: botStaff | null;
		error(message: messageContent, deleteAfter?: number): Promise<void>;
		info(message: messageContent, deleteAfter?: number): Promise<void>;
	}
}

declare global {
	namespace Express {
		interface Request {
			client: Client;
			auth: null | string;
		}
	}
}
