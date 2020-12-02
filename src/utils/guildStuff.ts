import Server from "../models/server";
import events from "../utils/events";

import { client } from "../";
import { creator, DEV_MODE } from "./config";
import { Guild, MessageEmbed } from "discord.js";
import { startStatus } from "./status";

const newServer = (guild: Guild) => {
	let desc = "Konnichiwa ( ´ ▽ ` )\n";
	desc += "Thank you for adding me!\n";
	desc += "Type zt!help for commands.";

	const embed = new MessageEmbed();
	embed.setDescription(desc);
	embed.setColor(DEV_MODE ? "#FF00FF" : "#00FFFF");
	guild.owner.send(embed);

	new Server({
		serverid: guild.id,
	}).save();
};

export const messageCreator = (content: string, error: boolean = false) => {
	let description = `\`\`\`md\n`;
	description += `# Logged in as: ${client.user.tag}!\n`;
	description += `# Enviroment: ${process.env.NODE_ENV}\n`;
	description += `# Node Version: ${process.version}\n`;
	description += `# OS: ${process.platform}\n`;
	description += `# Message: ${content}\n`;
	description += `# Message is ${error ? "" : "not "}an error.\n`;
	description += `\`\`\``;

	const embed = new MessageEmbed();
	embed.setColor(error ? "#FF0000" : DEV_MODE ? "#FF00FF" : "#00fFfF");
	embed.setTitle("New message!");
	embed.setDescription(description);
	embed.setTimestamp();

	client.users.cache.get(creator).send(embed);
};

const guildStuff = () => {
	client.on(events.GUILDDELETE, async (guild) => {
		(
			await Server.findOne({
				serverid: guild.id,
			})
		).deleteOne();
	});

	client.on(events.GUILDCREATE, newServer);

	client.on(events.READY, () => {
		console.log(`> Logged in as ${client.user.tag}!`);
		startStatus();

		client.guilds.cache.forEach(async (guild) => {
			const server = await Server.findOne({
				serverid: guild.id,
			});

			if (server == undefined) {
				newServer(guild);
			}

			const serversInDb = await Server.find();
			serversInDb.forEach(async (serverDB) => {
				if (
					client.guilds.cache.some(
						(servers) => servers.id == serverDB.toJSON().serverid,
					) == false
				) {
					await serverDB.deleteOne();
				}
			});
		});

		messageCreator(`Bot started!`);
	});
};

export default guildStuff;
