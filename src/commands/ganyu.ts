import { AxiosResponse } from "axios";
import { Collection, CommandInteraction, MessageButton } from "discord.js";
import { ButtonCommand, Command } from "../classes/Command.js";
import { GANYU_API_URL } from "../utils/config.js";
import { getUserDetails } from "../utils/member.js";

export default class Ganyu extends Command {
	public name = "ganyu";
	public description = "Get a cute Ganyu <3";

	public buttonInteractions: Collection<string, ButtonCommand> = new Collection<string, ButtonCommand>([
		[
			"reload",
			new (class Reload extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Ganyu");
			})(this.client, this),
		],
	]);

	public async execute(interaction: CommandInteraction) {
		const response = (await this.client._zerotwo.axios.get(GANYU_API_URL).catch((err) => err.response)) as
			| AxiosResponse
			| undefined;

		if (response?.status !== 200)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: response?.statusText ?? "Unknown error",
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const url = response.data.data.url;

		const { username, icon } = await getUserDetails(interaction);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: username,
						icon_url: icon,
					},
					description: `[Ganyu](${url})`,
					url: "https://ganyu.one",
					image: {
						url,
					},
				}),
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						...this.buttonsWithState(interaction.user.id, ""),
						new MessageButton().setStyle("LINK").setLabel("Open").setURL(url),
					],
				},
			],
		});
	}
}
