import { apiCommand } from "../../utils/commands/fetchApiCommands";

module.exports = {
	name: "gecg",
	description: "Memes for catgirls!",
	async execute(message, args) {
		await apiCommand({
			message,
			args,
			description: this.description,
			endpoint: "/gecg",
		});
	},
	type: 5,
} as Command;
