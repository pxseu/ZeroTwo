declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any>;
		player: any;
	}
	export interface Message {
		guildConf: Collection<unknown, any>;
	}
}
