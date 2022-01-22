import { CommandInteraction, CommandInteractionOption, GuildMember, MessageEmbed, Util } from "discord.js";
import { Imperial } from "imperial.js";
import vm from "vm";
import { inspect } from "util";
import { Command, CommandType, OptionTypes } from "../classes/Command.js";

export default class Dev extends Command {
	public name = "dev";
	public type = CommandType.CHAT_INPUT;
	public description = "Dev command";
	public options = [
		{ name: "info", type: OptionTypes.SUB_COMMAND, description: "Info about the bot" },
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
			case "info":
				return this.info(interaction);

			case "eval":
				return this.eval(interaction, subcommand.options!);

			default:
				return interaction.editReply({ embeds: [new MessageEmbed({ description: "aha" })] });
		}
	}

	private async info(interaction: CommandInteraction) {
		const data = await Promise.all([
			this.client.shard!.fetchClientValues("guilds.cache.size"),
			this.client.shard!.fetchClientValues("users.cache.size"),
		] as Promise<number[]>[]);

		return interaction.editReply({
			embeds: [
				this.client._zerotwo.embed({
					title: "Info",
					description: "Some info about the bot",
					fields: [
						{
							name: "NAME",
							value: `\`${this.client.user!.tag}\``,
							inline: true,
						},
						{
							name: "ID",
							value: `\`${this.client.user!.id}\``,
							inline: true,
						},
						{
							name: "CREATED",
							value: `<t:${~~(this.client.user!.createdAt.getTime() / 1000)}:R>`,
							inline: true,
						},
						{
							name: "COMMANDS",
							value: `\`${this.client._zerotwo.commands.size}\``,
							inline: true,
						},
						{
							name: "SHARDS",
							value: `\`${this.client.shard!.count}\``,
							inline: true,
						},
						{
							name: "USERS",
							value: `\`${data[1].reduce((a, b) => a + b, 0)}\``,
							inline: true,
						},
						{
							name: "GUILDS",
							value: `\`${data[0].reduce((a, b) => a + b, 0)}\``,
							inline: true,
						},
						{
							name: "STARTED",
							value: `<t:${~~((Date.now() - process.uptime()) / 1000)}:R>`,
							inline: true,
						},
						{
							name: "NODE VERSION",
							value: `\`${process.versions.node}\``,
							inline: true,
						},
					],
					thumbnail: {
						url: this.client.user!.avatarURL() ?? this.client.user!.defaultAvatarURL,
					},
				}),
			],
		});
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
