import { Message, User } from "discord.js";

export const fetchUser = (message: Message, args: string[]) =>
	new Promise<User>(async (resolve, reject) => {
		if (args.length < 1) {
			reject("Args are emtpy.");
		}
		const userInput = args.join(" ").toLocaleLowerCase();
		const regexMention = userInput.match(/<@!?(\d{18})>/gi);
		const regexId = userInput.match(/(\d{18})/gi);

		if (regexMention) {
			const user = await message.client.users.fetch(
				regexMention[0].match(/\d+/gim)[0],
			);
			resolve(user);
			return;
		}

		if (regexId) {
			const user = await message.client.users.fetch(regexId[0]);
			resolve(user);
			return;
		}

		const member =
			message.guild.members.cache.find(
				(r) => r.user.username.toLowerCase() === userInput,
			) ||
			message.guild.members.cache.find(
				(ro) => ro.displayName.toLowerCase() === userInput,
			);
		resolve(member?.user);
	});
