declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any>;
	}
	export interface Message {
		guildConf: Collection<unknown, any>;
	}
}
