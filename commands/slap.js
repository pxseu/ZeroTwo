const { MessageEmbed } = require("discord.js");
const { getImage } = require("../utils/getImage");
//const { patgifs } = require('../utils/config');

module.exports = {
	name: "slap",
	description: "Slap someone!",
	async execute(message, args) {
		//const pat = patgifs[Math.floor(Math.random() * patgifs.length)];

		const tagged =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(r) =>
					r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
			) ||
			message.guild.members.cache.find(
				(ro) =>
					ro.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
			);

		const embed = new MessageEmbed();
		if (tagged == undefined || tagged.id == message.author.id) {
			embed.setDescription("Please mention someone to slap!");
		} else {
			const slap = await getImage("/slap");
			embed.setDescription(`<@${message.author.id}> slaps <@${tagged.id}>.`);
			embed.setImage(slap.url);
		}
		embed.setColor("RANDOM");
		message.channel.send(embed);
	},
	type: 3,
};
