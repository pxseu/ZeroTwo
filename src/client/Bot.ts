import { Client, Message } from "discord.js";
import { intents } from "../config.js";

export class ZeroTwo {
	private client: Client;

	constructor() {
		this.client = new Client({ intents });
		this.client.on("messageCreate", this.handleMessage);
	}

	private async handleMessage(message: Message) {
		if (message.author.bot) return;

		// timeout logic ?

		// message logic

		try {
			// run the command
			console.log(`${message.author.username}#${message.author.discriminator}: ${message}`);
		} catch (e) {
			console.error(e);
			console.log("bruh");
		}
	}

	public async login(token: string) {
		await this.client.login(token);
		console.log(`> Connected as ${this.client.user!.username}#${this.client.user!.discriminator}`);
	}
}
