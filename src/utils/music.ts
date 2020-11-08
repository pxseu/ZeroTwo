import { client } from "../";
import { Player } from "discord-player";

const music = () => {
	const player = new Player(client);
	return player;
};

export default music;
