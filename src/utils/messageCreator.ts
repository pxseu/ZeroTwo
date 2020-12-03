import { client } from "..";
import { MessageEmbed } from "discord.js";
import { creator, DEV_MODE } from "./config";

export const messageCreator = (content: string, error: boolean = false) => {
	let description = `\`\`\`md\n`;
	description += `# Logged in as: ${client.user.tag}!\n`;
	description += `# Enviroment: ${process.env.NODE_ENV}\n`;
	description += `# Node Version: ${process.version}\n`;
	description += `# OS: ${process.platform}\n`;
	description += `# Message: ${content}\n`;
	description += `\`\`\``;

	const embed = new MessageEmbed();
	embed.setColor(error ? "#FF0000" : DEV_MODE ? "#FF00FF" : "#00fFfF");
	embed.setTitle(error ? "ERROR" : "New message!");
	embed.setDescription(description);
	embed.setTimestamp();

	client.users.cache.get(creator).send(embed);
};