import { filters } from "../utils/config";

module.exports = {
	name: "filter",
	description: "filter",
	execute(message, args) {
		if (!message.member.voice.channel) {
			message.error("You're not in a voice channel.");
			return;
		}

		if (!message.client.player.isPlaying(message)) {
			message.error("No music playing on this server.");
			return;
		}

		const filter = args[0];
		if (!filter) {
			message.error("Please specify a valid filter to enable or disable");
			return;
		}

		const filterToUpdate = Object.values(filters).find(
			(f) => f.toLowerCase() === filter.toLowerCase()
		);

		if (!filterToUpdate) {
			message.error("This filter doesn't exist");
			return;
		}

		const filterRealName = Object.keys(filters).find((f) => filters[f] === filterToUpdate);

		const queueFilters = message.client.player.getQueue(message).filters;
		const filtersUpdated = {};
		filtersUpdated[filterRealName] = queueFilters[filterRealName] ? false : true;
		message.client.player.setFilters(message, filtersUpdated);

		if (filtersUpdated[filterRealName]) {
			embed.setDescription(
				`I'm adding the filter to the music, please wait... \nNote: the longer the music is, the longer this will take.`
			);
		} else {
			embed.setDescription(
				`I'm disabling the filter on the music, please wait... \nNote: the longer the music is playing, the longer this will take`
			);
		}
		message.channel.send(embed);
	},
	type: 4,
	aliases: ["setfilter"],
} as Command;
