import { CommandInteraction, CommandInteractionOption } from "discord.js";
import vm from "vm";
import { inspect } from "util";
import { SubCommand, OptionTypes } from "../../classes/Command.js";

export default class DevEval extends SubCommand {
	public name = "eval";
	public description = "Evaluate code";
	public options = [{ name: "code", description: "Code to eval", type: OptionTypes.STRING, required: true }];

	public async execute(interaction: CommandInteraction, args?: readonly CommandInteractionOption[]) {
		if (!this.client._zerotwo.handy.isOwner(interaction.user.id)) {
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You are not allowed to use this command",
					}),
				],
			});
		}

		try {
			const code = args?.[0].value as string;
			const script = new vm.Script(code, {
				filename: "pxseu_amazing_eval_machine.js",
				displayErrors: true,
				timeout: 30000,
			});

			const context = vm.createContext({
				...globalThis,
				...{
					interaction,
					args,
					self: this,
					kill: process.exit,
				},
			});

			const start = Date.now();

			let evaled = await script.runInContext(context);

			const time = Date.now() - start;

			if (typeof evaled !== "string") evaled = inspect(evaled);

			await this.client._zerotwo.handy.embedTooLong(
				interaction,
				this.client._zerotwo.embed({
					title: "Evaluation",
					footer: {
						text: `Evaluated in \`${time}\`ms`,
						icon_url: this.client.user?.avatarURL() ?? this.client.user?.defaultAvatarURL,
					},
					timestamp: new Date(),
				}),
				evaled,
				"js",
			);
		} catch (err: any) {
			await this.client._zerotwo.handy.embedTooLong(
				interaction,
				this.client._zerotwo.embed({
					title: "Error",
				}),
				String(err.stack ? err.stack : err),
				"xl",
			);
		}
	}
}
