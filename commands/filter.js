const { MessageEmbed } = require("discord.js");
const { filters } = require("../utils/config");

module.exports = {
	name: "filter",
	description: "filter",
	execute(message, args) {
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (!message.member.voice.channel) {
			embed.setDescription(`You're not in a voice channel`);
			return message.channel.send(embed);
		}

		if (!message.client.player.isPlaying(message.guild.id)) {
			embed.setDescription(`No music playing on this server`);
			return message.channel.send(embed);
		}

		const filter = args[0];
		if (!filter) {
			embed.setDescription(
				`Please specify a valid filter to enable or disable`
			);
			return message.channel.send(embed);
		}

		const filterToUpdate = Object.values(filters).find(
			(f) => f.toLowerCase() === filter.toLowerCase()
		);

		if (!filterToUpdate) {
			embed.setDescription(`This filter doesn't exist`);
			return message.channel.send(embed);
		}

		const filterRealName = Object.keys(filters).find(
			(f) => filters[f] === filterToUpdate
		);

		const queueFilters = message.client.player.getQueue(message.guild.id)
			.filters;
		const filtersUpdated = {};
		filtersUpdated[filterRealName] = queueFilters[filterRealName]
			? false
			: true;
		message.client.player.setFilters(message.guild.id, filtersUpdated);

		if (filtersUpdated[filterRealName]) {
			embed.setDescription(
				`I'm adding the filter to the music, please wait... Note: the longer the music is, the longer this will take ${emotes.music}`
			);
		} else {
			embed.setDescription(
				`I'm disabling the filter on the music, please wait... Note: the longer the music is playing, the longer this will take ${emotes.music}`
			);
		}
		message.channel.send(embed);
	},
	type: 4,
	aliases: ["setfilter"],
};
