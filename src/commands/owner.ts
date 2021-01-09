import { Util } from "discord.js";

module.exports = {
	name: "owner",
	description: "Owner!",
	async execute(message) {
		const app = await message.client.fetchApplication();
		const owner = await message.client.users.fetch(app.owner.id);

		message.info(`My owner is \`${Util.escapeMarkdown(owner.tag)}\` (${owner.id})`);
	},
	type: 0,
	aliases: [],
} as Command;
