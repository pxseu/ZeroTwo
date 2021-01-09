import { client } from "..";
import { MessageEmbed } from "discord.js";
import { creator, DEV_MODE } from "./config";
import { Util } from "discord.js";

export const messageCreator = (content: string, error = false): void => {
	let description = `# Logged in as: ${client.user?.tag}!\n`;
	description += `# Enviroment: ${process.env.NODE_ENV}\n`;
	description += `# Node Version: ${process.version}\n`;
	description += `# OS: ${process.platform}\n`;
	description += `# Message: ${content}\n`;

	const embed = new MessageEmbed();
	embed.setColor(error ? "#FF0000" : DEV_MODE ? "#FF00FF" : "#00fFfF");
	embed.setTitle(error ? "ERROR" : "New message!");
	embed.setDescription(`\`\`\`md\n${Util.cleanCodeBlockContent(description)}\`\`\``);
	embed.setTimestamp();

	client.users
		.fetch(creator)
		.then((c) => {
			c.send(embed);
		})
		.catch(() => {
			console.log(`> CANNOT MESSAGE OWNER`);
		});
};
