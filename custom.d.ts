import type { guildConf } from "./src/models/server";
import type { Client } from "discord.js";

declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any>;
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
