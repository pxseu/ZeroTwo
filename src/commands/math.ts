import { evaluate } from "mathjs";

module.exports = {
	name: "math",
	description: "Do some math for you!",
	async execute(message, args) {
		const equasion = args.join(" ");

		if (!equasion) {
			message.info("Provide some math to calculate.");
			return;
		}

		try {
			const response = await evaluate(equasion);
			message.info({ title: "Calculated:", text: response });
		} catch (e) {
			message.error("Failed to calculate");
		}
	},
	type: 1,
	aliases: ["calc"],
} as Command;
