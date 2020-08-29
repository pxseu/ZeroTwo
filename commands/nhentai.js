const { MessageEmbed } = require('discord.js');
const { API } = require('nhentai-api');

const api = new API();

module.exports = {
	name: 'nhentai',
	description: 'Find your favourite doujin.',
	execute(message, args, guildConf) {
		const embed = new MessageEmbed();
		embed.setColor('RANDOM');

		if (args == undefined || args[0] == undefined) {
			embed.setDescription(
				`Usage: \n\`\`${guildConf.prefix}nhentai [number]\`\``
			);
			return message.channel.send(embed);
		}

		if (args[1] == undefined && !isNaN(args[0])) {
			return api.getBook(parseInt(args[0])).then((book) => {
				embed.setDescription(
					`Doujin: **[${parseInt(args[0])}](https://nhentai.net/g/${parseInt(
						args[0]
					)})**
                    \nPages: ${book.pages.length}
                    \nTags: \`\`${book.tags
											.map((tag) => tag.name)
											.join('``, ``')}\`\`
                    `
				);
				embed.setImage(api.getImageURL(book.cover));
				embed.setFooter(
					`PS You can read it with: | ${guildConf.prefix}nhentai ${parseInt(
						args[0]
					)} <page number> |`
				);
				message.channel.send(embed);
			});
		}

		if (isNaN(args[1]) == false && args[0] != 0) {
			return api.getBook(parseInt(args[0])).then((book) => {
				embed.setDescription(
					`Doujin: **[${parseInt(args[0])}](https://nhentai.net/g/${parseInt(
						args[0]
					)})**`
				);
				embed.setFooter(`Page: ${parseInt(args[1])}`);
				embed.setImage(api.getImageURL(book.pages[parseInt(args[1]) - 1]));
				message.channel.send(embed);
			});
		}

		embed.setDescription('```css\n[Invalid Id or Page]```');
		message.channel.send(embed);
	},
	type: 3,
	aliases: ['doujin', 'hentai'],
};
