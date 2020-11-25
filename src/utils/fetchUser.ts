import { Message, User } from "discord.js";

export const fetchUser = (message: Message, args: string[]) =>
	new Promise<User>(async (resolve, reject) => {
		if (args.length < 1) {
			reject("Args are emtpy.");
		}
		const userInput = args.join(" ").toLocaleLowerCase();
		if (userInput.match(/^(\d{18})?$/)) {
			const user = await message.client.users.fetch(userInput);
			resolve(user);
		}
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.find(
				(r) => r.user.username.toLowerCase() === userInput,
			) ||
			message.guild.members.cache.find(
				(ro) => ro.displayName.toLowerCase() === userInput,
			);
		resolve(member?.user);
	});
