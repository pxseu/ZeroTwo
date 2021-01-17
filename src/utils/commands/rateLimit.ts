import { Message, Collection } from "discord.js";
import { cooldowns } from "./mainMessageHandler";

export const defaultCooldown = 3;

export const rateLimit = (message: Message, command: Command): boolean => {
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000;

	if (timestamps.has(message.author.id)) {
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;

				message.info(
					`<@${message.author.id}>, 
				Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`,
					2000
				);

				return true;
			}
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	return false;
};
