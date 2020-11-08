import Server from "../models/server";
import events from "../utils/events";

import { client } from "../";

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
						//@ts-ignore
						(servers) => servers.id == serverDB.serverid,
					) == false
				) {
					await serverDB.deleteOne();
				}
			});
		});
	});
};

export default guildStuff;
