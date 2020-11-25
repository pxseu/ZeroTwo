import { Message, MessageEmbed } from "discord.js";
import { API } from "nhentai-api";
import { embedColor } from "../utils/config";

const api = new API();

module.exports = {
	name: "nhentai",
	description: "Find your favourite doujin.",
	execute(message: Message, args: string[]) {
		const embed = new MessageEmbed();
		embed.setColor(embedColor);

		if (args == undefined || args[0] == undefined) {
			embed.setDescription(
				`Usage: \n\`\`${message.guildConf.prefix}nhentai [number]\`\``,
			);
			return message.channel.send(embed);
		}

		if (args[1] == undefined && !isNaN(parseInt(args[0]))) {
			return api.getBook(parseInt(args[0])).then((book) => {
				embed.setDescription(
					`Doujin: **[${parseInt(
						args[0],
					)}](https://nhentai.net/g/${parseInt(args[0])})**
                    \nPages: ${book.pages.length}
                    \nTags: \`\`${book.tags
						.map((tag) => tag.name)
						.join("``, ``")}\`\`
                    `,
				);
				embed.setImage(api.getImageURL(book.cover));
				embed.setFooter(
					`PS You can read it with: | ${
						message.guildConf.prefix
					}nhentai ${parseInt(args[0])} <page number> |`,
				);
				message.channel.send(embed);
			});
		}

		if (isNaN(parseInt(args[1])) == false && parseInt(args[0]) != 0) {
			return api
				.getBook(parseInt(args[0]))
				.then((book: { pages: any[] }) => {
					embed.setDescription(
						`Doujin: **[${parseInt(
							args[0],
						)}](https://nhentai.net/g/${parseInt(args[0])})**`,
					);
					embed.setFooter(`Page: ${parseInt(args[1])}`);
					embed.setImage(
						api.getImageURL(book.pages[parseInt(args[1]) - 1]),
					);
					message.channel.send(embed);
				});
		}

		embed.setDescription("```css\n[Invalid Id or Page]```");
		message.channel.send(embed);
	},
	type: 5,
	aliases: ["doujin"],
};
