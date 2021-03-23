import { MessageEmbed } from "discord.js";
import { embedColorInfo, filters } from "../../utils/config";

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
			const filtersStatuses = [[], []];

			Object.keys(filters).forEach((filterName) => {
				const array =
					filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
				array.push(
					`\`${filters[filterName]}\` : \`${
						JSON.parse(message.client.player.getQueue(message).filters[filterName]) ? "Enabled" : "Disabled"
					}\``
				);
			});

			const embed = new MessageEmbed();
			embed.setColor(embedColorInfo);
			embed.setTimestamp();

			embed.setDescription(
				`List of all filters enabled or disabled.\nUse \`${message.guildConf.prefix}filter <filter name>\` to add a filter to a song.`
			);
			embed.addField("**Filters**", filtersStatuses[0].join("\n"), true);
			embed.addField("** **", filtersStatuses[1].join("\n"), true);
			message.channel.send(embed);
			return;
		}

		const filterToUpdate = Object.values(filters).find((f) => f.toLowerCase() === filter.toLowerCase());

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
			message.info(
				"I'm adding the filter to the music, please wait... \nNote: the longer the music is, the longer this will take."
			);
			return;
		}

		message.info(
			"I'm disabling the filter on the music, please wait... \nNote: the longer the music is playing, the longer this will take"
		);
	},
	type: 4,
	aliases: ["setfilter"],
} as Command;
