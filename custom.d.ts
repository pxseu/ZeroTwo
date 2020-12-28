import type { guildConf } from "./src/models/server";
import type { Client } from "discord.js";
import { botStaff } from "./src/models/botStaff";
import { Message } from "discord.js";

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
		/* player: any; */
	}
	export interface Message {
		guildConf: guildConf;
		staff: botStaff | null;
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
