import { client } from "../..";
import { MessageEmbed, WebhookClient } from "discord.js";
import { DEV_MODE } from "../config";
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

	try {
		const webhookClient = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

		webhookClient.send({
			username: client.user.username,
			avatarURL: client.user.avatarURL({ dynamic: true }),
			embeds: [embed],
		});
	} catch (e) {
		console.error("> INVALID WEBHOOK TOKEN");
	}
};
