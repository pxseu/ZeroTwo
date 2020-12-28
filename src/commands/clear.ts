import { bypassIds } from "../utils/config";

module.exports = {
	name: "clear",
	description: "clear channel",
	async execute(message, args) {
		if (
			(Object.keys(bypassIds).some((id) => id == message.author.id) ||
				message.member.hasPermission("ADMINISTRATOR")) == false
		) {
			message.reply("You don't have the permission to use this command.");
			return;
		}

		const amount = args.join(" ");
		if (!amount) {
			message.reply("You haven't given an amount of messages that should be deleted!");
			return;
		}
		if (isNaN(parseInt(amount))) {
			message.reply("The amount parameter isn't a number!");
			return;
		}
		if (parseInt(amount) > 100) {
			message.reply("You can't delete more than 100 messages at once!");
			return;
		}
		if (parseInt(amount) < 1) {
			message.reply("You have to delete at least 1 message!");
			return;
		}
		await message.channel.messages
			.fetch({
				limit: parseInt(amount),
			})
			.then((messages) => {
				if (message.channel.type == "dm") return;
				message.channel.bulkDelete(messages);
				message.channel.send(`Succesfully deleted: ${amount} messages.`).then((msg) => {
					setTimeout(() => {
						msg.delete();
					}, 4000);
				});
			});
		return;
	},
	type: 2,
	aliases: ["purge"],
	cooldown: 10,
} as Command;
