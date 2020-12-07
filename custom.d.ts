import type { guildConf } from "./src/models/server";
import type { Client } from "discord.js";

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
		commands: Collection<unknown, Command>;
		player: any;
	}
	export interface Message {
		guildConf: guildConf;
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
