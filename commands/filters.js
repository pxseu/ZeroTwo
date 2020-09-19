const { MessageEmbed } = require("discord.js");
const { filters } = require("../utils/config");

module.exports = {
	name: "filters",
	description: "filters",
	execute(message) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (!message.member.voice.channel) {
			embed.setDescription(`You're not in a voice channel.`);
			return message.channel.send(embed);
		}

		//If there's no music
		if (!client.player.isPlaying(message.guild.id)) {
			embed.setDescription(`No music playing on this server ${emotes.error}`);
			return message.channel.send(embed);
		}

		const filtersStatuses = [[], []];

		Object.keys(filters).forEach((filterName) => {
			const array =
				filtersStatuses[0].length > filtersStatuses[1].length
					? filtersStatuses[1]
					: filtersStatuses[0];
			array.push(
				filters[filterName] +
					" : " +
					client.player.getQueue(message.guild.id).filters[filterName]
			);
		});

		embed.setDescription(
			`List of all filters enabled or disabled.\nUse \`${config.prefix}filter\` to add a filter to a song.`
		);
		embed.addField("**Filters**", filtersStatuses[0].join("\n"), true);
		embed.addField("** **", filtersStatuses[1].join("\n"), true);

		//Message
		message.channel.send(embed);
	},
	type: 4,
};
