import { apiCommand } from "../utils/commands/fetchApiCommands";

module.exports = {
	name: "neko",
	description: "Random neko!",
	async execute(message, args) {
		await apiCommand({
			message,
			args,
			description: this.description,
			endpoint: "/neko",
		});
	},
	type: 5,
	aliases: ["catgirl", "catgirls", "nekos"],
} as Command;
