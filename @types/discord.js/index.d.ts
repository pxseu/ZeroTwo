import type { ZeroTwo } from "../../src/classes/ZeroTwo";

declare module "discord.js" {
	export interface Client {
		_zerotwo: ZeroTwo;
	}
}
