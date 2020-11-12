import Server from "../models/server";
import events from "../utils/events";

import { client } from "../";
import { owner } from "./config";
import { MessageEmbed } from "discord.js";

const guildStuff = () => {
	client.on(events.GUILDDELETE, async (guild) => {
		(
			await Server.findOne({
				serverid: guild.id,
			})
		).deleteOne();
	});

	client.on(events.GUILDDELETE, (guild) => {
		guild.owner.send(
			`Konnichiwa ( \´ ▽ \` )\nThank you for adding me!\nType zt!help for commands.`,
		);

		new Server({
			serverid: guild.id,
		}).save();
	});

	client.on(events.READY, () => {
		console.log(`> Logged in as ${client.user.tag}!`);
		client.user.setPresence({
			status: "dnd",
			activity: {
				name: "help | pxseu.com",
				type: "STREAMING",
				url: "https://www.twitch.tv/monstercat",
			},
		});

		client.guilds.cache.forEach(async (guild) => {
			const server = await Server.findOne({
				serverid: guild.id,
			});

			if (server == undefined) {
				guild.owner.send(
					`Konnichiwa ( \´ ▽ \` )\nThank you for adding me!\nType zt!help for commands.`,
				);

				new Server({
					serverid: guild.id,
				}).save();
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

		let description = `\`\`\`md\n`;
		description += `# Logged in as: ${client.user.tag}!\n`;
		description += `# Server count: ${client.guilds.cache.size}\n`;
		description += `# User count: ${client.users.cache.size}\n`;
		description += `# Enviroment: ${process.env.NODE_ENV}\n`;
		description += `# Node Version: ${process.version}\n`;
		description += `# OS: ${process.platform}\n`;
		description += `\`\`\``;

		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setTitle("Bot started!");
		embed.setDescription(description);
		embed.setTimestamp();

		client.users.cache.get(owner).send(embed);
	});
};

export default guildStuff;
