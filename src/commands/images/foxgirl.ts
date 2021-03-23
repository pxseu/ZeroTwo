import { apiCommand } from "../../utils/commands/fetchApiCommands";

module.exports = {
	name: "foxgirl",
	description: "Foxgirl!",
	async execute(message, args) {
		await apiCommand({
			message,
			args,
			description: this.description,
			endpoint: "/fox",
		});
	},
	type: 5,
	aliases: ["kitsune", "fox_girl"],
} as Command;
