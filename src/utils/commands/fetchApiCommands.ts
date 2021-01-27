import { Message, MessageEmbed } from "discord.js";
import { getImage } from "../api/apiStuff";
import { embedColor } from "../config";
import type { Endpoints } from "../api/apiStuff";

interface params {
	message: Message;
	args: string[];
	description: string;
	endpoint: Endpoints;
}

export const apiCommand = async ({ message, args, description, endpoint }: params): Promise<void> => {
	const showMany = !!args.find((arg) => arg.toLowerCase() == "--many");
	const apiFetch = await getImage(endpoint);
	const embed = new MessageEmbed();
	embed.setColor(embedColor);
	embed.setTitle(description);
	showMany && embed.setDescription("1/5");
	embed.setImage(apiFetch.url);
	embed.setFooter(apiFetch.api);
	embed.setTimestamp();
	const msg = await message.channel.send(embed);
	if (showMany) {
		let loopCounter = 0;
		const interval = setInterval(async () => {
			loopCounter++;
			const newApiFetch = await getImage(endpoint);
			embed.setDescription;
			embed.setImage(newApiFetch.url);
			embed.setFooter(newApiFetch.api);
			embed.setDescription(`${loopCounter + 1}/5`);
			msg.edit(embed);

			if (loopCounter == 4) {
				clearInterval(interval);
			}
		}, 7 * 1000); /* 7 seconds */
	}
};
