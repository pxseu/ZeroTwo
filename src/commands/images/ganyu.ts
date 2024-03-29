import { AxiosResponse } from "axios";
import { Collection, CommandInteraction, MessageButton } from "discord.js";
import { ButtonCommand, Command } from "../../classes/Command.js";

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

	private async getImage() {
		const { status, statusText, data } = await this.client._zerotwo.axios
			.get(GANYU_API_URL)
			.catch((err) => err.response as AxiosResponse);

		if (status !== 200) {
			throw new Error(statusText ?? "Unknown error");
		}

		const { url, id } = data.data;
		const illust = `${PIXIV_ILLUST_URL}${id}`;

		return { url, illust };
	}

	public async execute(interaction: CommandInteraction) {
		if (interaction.isButton()) {
			const meta = this.client._zerotwo.handy.getMeta(interaction.customId);

			if (meta?.author !== "" && meta?.author !== interaction.user.id) return interaction.editReply({});
		}

		const image = await this.getImage().catch((err) => err as Error);

		if (image instanceof Error)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: image.message,
						color: this.client._zerotwo.colors.toNumber("red"),
					}),
				],
			});

		const { illust, url } = image;
		const { username, icon } = await this.client._zerotwo.handy.getUserDetails(interaction);

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
