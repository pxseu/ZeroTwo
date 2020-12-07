import type { guildConf } from "./src/models/server";
import type { Client } from "discord.js";
import { messageCreator } from "./src/utils/messageCreator";
import { botStaff } from "./src/models/botStaff";

declare global {
	type Command = {
		name: string;
		description?: string;
		execute: Function | any;
		aliases?: string[];
		type: number;
		cooldown?: number;
	};
}
declare module "discord.js" {
	export interface Client {
		commands: Collection<string, Command>;
		player: any;
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
