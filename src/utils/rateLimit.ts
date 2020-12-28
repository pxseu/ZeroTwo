import { Message, Collection, MessageEmbed } from "discord.js";
import { embedColorInfo } from "./config";
import { cooldowns } from "./mainMessageHandler";

export const rateLimit = (message: Message, command: Command): boolean => {
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown ?? 3) * 1000;

	if (timestamps.has(message.author.id)) {
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;

				const embed = new MessageEmbed();
				embed.setDescription(
					`<@${message.author.id}>, 
                        Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
						command.name
					}\` command.`
				);
				embed.setColor(embedColorInfo);
				message.reply(embed).then((msg) => {
					setTimeout(() => {
						if (!msg.deleted) msg.delete().catch(console.error);
					}, 2000);
				});
				return true;
			}
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	return false;
};
