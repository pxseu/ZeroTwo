import { Client } from "discord.js";
import Server, { guildConf } from "../../models/server";
import { events } from "../config";
import { messageCreator } from "./logMessage";
import { startStatus } from "./status";

const guildStuff = (client: Client): void => {
	client.on(events.READY, async () => {
		console.log(`> Logged in as ${client.user.tag}!`);
		startStatus();

		const serversInDb = (await Server.find()) as guildConf[];

		serversInDb.forEach((srvDB) => {
			if (!client.guilds.cache.some((srv) => srv.id == srvDB.serverid)) return;
			srvDB.deleteOne();
		});

		console.log(`> SERVING IN: ${client.guilds.cache.size}`);

		messageCreator(`Bot started!`);
	});
};

export default guildStuff;
