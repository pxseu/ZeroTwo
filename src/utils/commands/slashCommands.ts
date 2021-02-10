/* eslint-disable */

import { client } from "../..";

const slashCommands = async (): Promise<void> => {
	//@ts-ignore
	const slashCommandsList = await client.api
		//@ts-ignore
		.applications(client.user.id)
		.commands.get();

	const data = {
		name: "uwu",
		description: "Send a cute uwu face!",
		options: [
			{
				type: 4,
				name: "face",
				description: "Choose one of the faces.",
				choices: [
					{
						name: "cute",
						value: 1,
					},
					{
						name: "cuter",
						value: 2,
					},
					{
						name: "even cuter",
						value: 3,
					},
					{
						name: "the cutest",
						value: 4,
					},
					{
						name: "the cutest omgaaaaaa",
						value: 5,
					},
				],
			},
		],
	};

	if (slashCommandsList.length == 0) {
		//@ts-ignore
		client.api
			//@ts-ignore
			.applications(client.user.id)
			.commands.post({
				data,
			});
	} else {
		//@ts-ignore
		client.api
			//@ts-ignore
			.applications(client.user.id)
			.commands(slashCommandsList[0].id)
			.patch({
				data,
			});
	}

	//@ts-ignore
	client.ws.on("INTERACTION_CREATE", async (interaction) => {
		console.log(interaction);
		const uwuFaces = ["(。U⁄ ⁄ω⁄ ⁄ U。)", "(◦ ᵕ ˘ ᵕ ◦)", "(⁄˘⁄ ⁄ ω⁄ ⁄ ˘⁄)♡", "( ͡o ꒳ ͡o )", " (U ᵕ U❁)"];
		/* console.log(interaction.data); */
		const user = await client.users.fetch(interaction.member.user.id);
		const description = interaction.data.options
			? uwuFaces[interaction.data.options[0].value - 1]
			: uwuFaces[Math.floor(Math.random() * uwuFaces.length)];
		//@ts-ignore
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					embeds: [
						{
							author: {
								name: user.username,
								icon_url: user.avatarURL({ dynamic: true }),
							},
							description,
							color: 16712191,
							footer: {
								icon_url: user.avatarURL({ dynamic: true }),
								text: "you wook cute <33",
							},
						},
					],
				},
			},
		});
		console.log(`> SLASH_COMMAND ${interaction.id} used`);
	});
};

export default slashCommands;
