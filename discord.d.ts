import type { guildConf } from "./src/models/server";

declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any>;
		player: any;
		nsfw: boolean;
	}
	export interface Message {
		guildConf: guildConf;
	}
}
