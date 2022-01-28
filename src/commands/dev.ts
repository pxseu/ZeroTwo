import { CommandInteraction, CommandInteractionOption, GuildMember, MessageEmbed, Util } from "discord.js";
import { Imperial } from "imperial.js";
import vm from "vm";
import { inspect } from "util";
import { Command, OptionTypes } from "../classes/Command.js";

export default class Dev extends Command {
	public name = "dev";
	public description = "Dev command";
	public options = [
		{
			name: "eval",
			type: OptionTypes.SUB_COMMAND,
			description: "Evaluate code",
			options: [{ name: "code", description: "Code to eval", type: OptionTypes.STRING, required: true }],
		},
	];

	private imperial = new Imperial(process.env.IMPERIAL_TOKEN);

	public async execute(interaction: CommandInteraction, args: readonly CommandInteractionOption[]) {
		const subcommand = args.find((a) => a.type === OptionTypes[1]);

		switch (subcommand?.name) {
			case "eval":
				return this.eval(interaction, subcommand.options!);

			default:
				return interaction.editReply({ embeds: [new MessageEmbed({ description: "aha" })] });
		}
	}

	private async eval(interaction: CommandInteraction, args: readonly CommandInteractionOption[]) {
		if (interaction.user.id !== "338718840873811979") {
			return interaction.editReply({
				embeds: [
					this.client._zerotwo.embed({
						description: "You are not allowed to use this command",
					}),
				],
			});
		}

		try {
			const code = args[0].value as string;
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

			let evaled = await script.runInContext(context);

			if (typeof evaled !== "string") evaled = inspect(evaled);

			await this.isTooLong(interaction, Util.escapeCodeBlock(evaled));
		} catch (err: any) {
			await this.isTooLong(interaction, `${Util.escapeCodeBlock(String(err.stack ? err.stack : err))}`);
		}
	}

	private async isTooLong(interaction: CommandInteraction, text: string): Promise<unknown> {
		const embed = this.client._zerotwo.embed({
			title: "Evaluated code",
			author: {
				name:
					(interaction.member instanceof GuildMember && interaction.member.nickname) ||
					interaction.user.username,
				iconURL: interaction.user.avatarURL() ?? interaction.user.defaultAvatarURL,
			},
		});

		if (text.length < 2001) {
			return interaction.editReply({
				embeds: [embed.setDescription(`\`\`\`xl\n${text}\n\`\`\``)],
			});
		}

		try {
			const response = await this.imperial.createDocument(text, { expiration: 1, longerUrls: true });

			await interaction.editReply({
				embeds: [embed.setDescription(`Message was too long: <${response.link}>`)],
			});
		} catch (error: any) {
			console.error(error);
			await interaction.editReply({ embeds: [embed.setDescription(`Unkown error: ${String(error.message)}`)] });
		}
	}
}
