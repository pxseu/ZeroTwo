import type { guildConf } from "./src/models/server";
import type { Client } from "discord.js";
import { botStaff } from "./src/models/botStaff";
import { Message } from "discord.js";
import { Player } from "discord-player";

interface messageContent {
	title?: string;
	text?: string;
	footer?: string;
}

declare global {
	type Command = {
		name: string;
		description?: string;
		execute: (message: Message, args: string[]) => void | Promise<void>;
		aliases?: string[];
		type: number;
		cooldown?: number;
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
		error(message: messageContent | string): Promise<void>;
		info(message: messageContent | string): Promise<void>;
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
