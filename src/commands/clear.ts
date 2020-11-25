import { bypassIds } from "../utils/config";
import { Message } from "discord.js";

module.exports = {
	name: "clear",
	description: "clear channel",
	async execute(message: Message, args: string[]) {
		if (
			(Object.keys(bypassIds).some((id) => id == message.author.id) ||
				message.member.hasPermission("ADMINISTRATOR")) == false
		)
			return message.reply(
				"You don't have the permision to use this command.",
			);

		const amount = args.join(" ");
		if (!amount)
			return message.reply(
				"You haven't given an amount of messages which should be deleted!",
			);
		if (isNaN(parseInt(amount)))
			return message.reply("The amount parameter isn`t a number!");
		if (parseInt(amount) > 100)
			return message.reply(
				"You can`t delete more than 100 messages at once!",
			);
		if (parseInt(amount) < 1)
			return message.reply("You have to delete at least 1 message!");
		await message.channel.messages
			.fetch({
				limit: parseInt(amount),
			})
			.then((messages) => {
				//@ts-ignore  it's already checekd somewhere else dummy
				message.channel.bulkDelete(messages);
				message.channel
					.send(`Succesfully deleted: ${amount} messages.`)
					.then((msg) => {
						setTimeout(() => {
							msg.delete();
						}, 4000);
					});
			});
		return 0;
	},
	type: 2,
	aliases: ["purge"],
	cooldown: 10,
};
