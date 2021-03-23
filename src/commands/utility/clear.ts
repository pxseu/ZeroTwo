import { bypassIds } from "../../utils/config";

module.exports = {
	name: "clear",
	description: "clear channel",
	async execute(message, args) {
		if (
			!(
				Object.keys(bypassIds).some((id) => id == message.author.id) ||
				message.member.hasPermission("MANAGE_MESSAGES")
			)
		) {
			message.info("You don't have the permission to use this command.");
			return;
		}

		const amount = parseInt(args.join(" "));
		if (!amount) {
			message.info("You haven't given an amount of messages that should be deleted!");
			return;
		}
		if (isNaN(amount)) {
			message.info("The amount parameter isn't a number!");
			return;
		}
		if (amount > 100) {
			message.info("You can't delete more than 100 messages at once!");
			return;
		}
		if (amount < 1) {
			message.info("You have to delete at least 1 message!");
			return;
		}
		const messages = await message.channel.messages.fetch({
			limit: amount,
		});

		if (message.channel.type == "dm") return;
		await message.channel.bulkDelete(messages);
		message.info(`Succesfully deleted: ${amount} messages.`, 4000);
		return;
	},
	type: 2,
	aliases: ["purge"],
	cooldown: 10,
} as Command;
