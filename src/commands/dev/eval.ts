import { inspect } from "node:util";
import vm from "node:vm";
import type { CommandInteraction, CommandInteractionOption } from "discord.js";
import { OptionTypes, SubCommand } from "../../classes/Command.js";

export default class Eval extends SubCommand {
	public description = "Evaluate code";
	public options = [
		{
			name: "code",
			description: "The code to execute",
			type: OptionTypes.STRING,
			required: true,
		},
	];

	public async execute(
		interaction: CommandInteraction,
		args?: readonly CommandInteractionOption[],
	) {
		if (!this.client._zerotwo.handy.isOwner(interaction.user.id))
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You are not allowed to use this command",
					}),
				],
			});

		const code = args?.find((arg) => arg.name === this.options[0].name)?.value as string;

		let evaled: string | undefined;
		let time: number | undefined;

		try {
			// capture stack
			const start = process.uptime();

			const script = new vm.Script(code, {
				filename: "pxseu_amazing_eval_machine.js",
			});

			const context = vm.createContext({
				...globalThis,
				...{
					interaction,
					client: this.client,
					author: interaction.user.id,
					bot: this.client.user?.id,
					args,
					self: this,
					process,
					import: (module: string) => import(module),
				},
			});

			evaled = await script.runInContext(context);

			time = process.uptime() - start;

			if (typeof evaled !== "string") evaled = inspect(evaled);
		} catch (err: unknown) {
			return this.client._zerotwo.handy.embedTooLong(
				interaction,
				this.client._zerotwo.embed({
					title: "Error",
				}),
				String(err instanceof Error && err.stack ? err.stack : err),
				"js",
			);
		}

		await this.client._zerotwo.handy.embedTooLong(
			interaction,
			this.client._zerotwo.embed({
				title: "Evaluation",
				footer: {
					text: `Evaluated in ${(time * 1000).toFixed(2)}ms`,
					icon_url: this.client.user?.avatarURL() ?? this.client.user?.defaultAvatarURL,
				},
				timestamp: new Date(),
			}),
			evaled,
			"js",
		);
	}
}
