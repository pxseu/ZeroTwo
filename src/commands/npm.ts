import { AxiosResponse } from "axios";
import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { ArgumentDefinition, Command, OptionTypes } from "../classes/Command.js";

const REGISTRY_URL = "https://registry.npmjs.org/";
const BASE_NPM_URL = "https://www.npmjs.com/package/";

export default class Npm extends Command {
	public description = "Query npm for a package";

	public ephermal = (_: unknown, args: readonly CommandInteractionOption[] = []) => {
		return (args.find((arg) => arg.name === this.options[1].name)?.value as boolean) || false;
	};

	public options: ArgumentDefinition[] = [
		{
			name: "name",
			description: "Query NPM for a specific package name",
			type: OptionTypes.STRING,
			required: true,
		},
		{ name: "ephermal", description: "If the command should be ephermal", type: OptionTypes.BOOLEAN },
	];

	public async execute(interaction: CommandInteraction, args: readonly CommandInteractionOption[] = []) {
		const query = args.find((arg) => arg.name === this.options[0].name)?.value as string;

		if (!query)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						color: this.client._zerotwo.colors.toNumber("red"),
						description: "No package name provided",
					}),
				],
			});

		const { status, statusText, data } = (await this.client._zerotwo.axios
			.get(`${REGISTRY_URL}${encodeURIComponent(query)}`)
			.catch((err) => err.response)) as AxiosResponse;

		if (status !== 200)
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						color: this.client._zerotwo.colors.toNumber("red"),
						description: `Error: ${statusText}`,
					}),
				],
			});

		const {
			name,
			description,
			homepage,
			"dist-tags": tags,
			author: { name: author },
			license,
		} = data;

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					title: name,
					description,
					url: homepage,
					fields: [
						{
							name: "Tags",
							value: Object.keys(tags)
								.map((t: string) => `\`${t}\``)
								.join(", "),
							inline: true,
						},
						{ name: "Author", value: `\`${author}\``, inline: true },
						{ name: "License", value: `\`${license}\``, inline: true },
						{ name: "Homepage", value: homepage },
						{
							name: "NPM",
							value: `${BASE_NPM_URL}${name}`,
						},
					],
				}),
			],
		});
	}
}
