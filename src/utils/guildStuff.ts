import Server, { guildConf } from "../models/server";
import events from "../utils/events";

import { client } from "../";
import { DEV_MODE } from "./config";
import { Guild, MessageEmbed } from "discord.js";
import { startStatus } from "./status";
import { messageCreator } from "./messageCreator";

const newServer = (guild: Guild) => {
	let desc = "Konnichiwa ( ´ ▽ ` )\n";
	desc += "Thank you for adding me!\n";
	desc += "Type zt!help for commands.";

	const embed = new MessageEmbed();
	embed.setDescription(desc);
	embed.setColor(DEV_MODE ? "#FF00FF" : "#00FFFF");
	//guild.owner.send(embed);

	new Server({
		serverid: guild.id,
	}).save();
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
						(server) =>
							server.id == (serverDB as guildConf).serverid,
					) == false
				) {
					await serverDB.deleteOne();
				}
			});
		});

		console.log(`> SERVING IN: ${client.guilds.cache.size}`);

		messageCreator(`Bot started!`);
	});
};

export default guildStuff;
