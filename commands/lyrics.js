module.exports = {
	name: 'lyrics',
	description: 'Current Songs lyrics (if possible to find)',
	async execute(message, args, guildConf, serverQueue, queue, client, Server){
		/*const Genius = require("node-genius");
		const geniusClient = new Genius(process.env.GeniusApi);
		if (!message.member.voiceChannel) return message.channel.send(
			'You have to be in a voice channel to stop the music!'
		);
		if (!serverQueue) return message.channel.send(
			'There is no song that I could write the lyrics of!'
		);
		songTitle = await serverQueue.songs[0].title
		console.log(songTitle)
		geniusClient.search(songTitle, async function (error, results) {
			console.log(await results)
		}); */
		message.channel.send("Not working sorry.")
	},
};