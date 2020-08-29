const { MessageEmbed } = require('discord.js');
const getImage = require('../utils/getImage');

module.exports = {
	name: 'nsfwneko',
	description: 'NSFW Nekos!',
	async execute(message, args) {
		const endpoints = ['/lewdkemo', '/nsfw_neko_gif'];
		const nsfwneko = await getImage(
			endpoints[Math.floor(Math.random() * endpoints.length)]
		);

		const embed = new MessageEmbed();
		embed.setColor('RANDOM');
		embed.setDescription(this.description);
		embed.setImage(nsfwneko.url);
		message.channel.send(embed);
	},
	type: 5,
	aliases: ['nneko'],
};
