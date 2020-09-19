const initMusic = (client) => {
	const { Player } = require("discord-player");

	const player = new Player(client);

	return player;
};

module.exports = initMusic;
