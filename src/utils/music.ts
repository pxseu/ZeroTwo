import { client } from "../";
import { Player } from "discord-player";
import type { Player as PlayerType } from "discord-player";

const music = (): PlayerType => {
	const player = new Player(client);
	return player;
};

export default music;
