import { AxiosResponse } from "axios";
import { Collection, CommandInteraction, MessageButton } from "discord.js";
import { ButtonCommand, Command } from "../classes/Command.js";
import { getUserDetails } from "../utils/member.js";

const PIXIV_ILLUST_URL = "https://www.pixiv.net/en/artworks/";
const GANYU_API_URL = "https://ganyu.one/v1/image/single";

export default class Ganyu extends Command {
	public description = "Get a cute Ganyu <3";

	public buttonInteractions: Collection<string, ButtonCommand> = new Collection([
		[
			"reload",
			new (class Reload extends ButtonCommand {
				public metadata = new MessageButton().setStyle("PRIMARY").setLabel("Ganyu");
			})(this),
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

		const { url, id } = response.data.data;
		const illust = `${PIXIV_ILLUST_URL}${id}`;

		const { username, icon } = await getUserDetails(interaction);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					author: {
						name: username,
						icon_url: icon,
					},
					description: `[Ganyu](${illust})`,
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
						new MessageButton().setStyle("LINK").setLabel("Source").setURL(illust),
						new MessageButton().setStyle("LINK").setLabel("Raw").setURL(url),
					],
				},
			],
		});
	}
}
