import { GuildMember } from "discord.js";
import { Message, User } from "discord.js";

const regexMention = /^<@!?(\d{18})>$/i;
const regexId = /^(\d{18})$/i;

export const fetchUser = (message: Message, args: string[]): Promise<User> =>
	new Promise<User>((resolve, reject) => {
		if (args.length < 1) {
			reject(new Error("Args are emtpy."));
			return;
		}

		const userInput = lower(args.join(" "));
		const regexMatch = regexMention.exec(userInput) ?? regexId.exec(userInput);

		if (regexMatch) {
			const fromCache = message.client.users.cache.get(regexMatch[1]);

			if (fromCache) {
				resolve(fromCache);
				return;
			}

			return message.client.users.fetch(regexMatch[1]).then(resolve, reject);
		}

		const member =
			message.guild.members.cache.find((r) => lower(r.user.username) === userInput) ||
			message.guild.members.cache.find((ro) => lower(ro.displayName) === userInput);
		resolve(member?.user);
	});

export const fetchMember = (message: Message, args: string[]): Promise<GuildMember> => {
	return new Promise((resolve, reject) => {
		if (args.length < 1) {
			reject(new Error("Args are emtpy."));
			return;
		}

		const userInput = lower(args.join(" "));
		const regexMatch = regexMention.exec(userInput) ?? regexId.exec(userInput);

		if (regexMatch) {
			const fromCache = message.guild.members.cache.get(regexMatch[1]);

			if (fromCache) {
				resolve(fromCache);
				return;
			}

			return message.guild.members.fetch().then((members) => {
				const foundMember = members.find((member) => member.id === regexMatch[1]);
				resolve(foundMember);
			}, reject);
		}

		const member =
			message.guild.members.cache.find((r) => lower(r.user.username) === userInput) ||
			message.guild.members.cache.find((ro) => lower(ro.displayName) === userInput);
		resolve(member);
	});
};

function lower(input: string): string {
	return input.toLowerCase();
}
