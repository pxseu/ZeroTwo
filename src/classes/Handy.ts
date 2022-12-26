import {
	ButtonInteraction,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	Guild,
	GuildBasedChannel,
	GuildMember,
	Interaction,
	MessageEmbed,
	Team,
	User,
	Util,
} from "discord.js";
import { Command, SubCommand } from "./Command";

export class Handy {
	constructor(client: Client) {
		Object.defineProperty(this, "client", { value: client });
	}

	private regexMention(id: string | null) {
		if (!id) return null;

		const regex = /^(<@!?(\d+)>)|(\d+)$/i.exec(id);

		return (regex?.[2] || regex?.[3]) ?? null;
	}

	private regexChannel(id: string | null): string | null {
		if (!id) return null;

		const regex = /^(<#(\d+)>)|(\d+)$/i.exec(id);

		return (regex?.[2] || regex?.[3]) ?? null;
	}

	/**
	 *  Get a user by an id from all shards
	 */
	public async getUser(id: string | null): Promise<User | null> {
		const userId = this.regexMention(id);

		if (!userId) return null;

		const cachedUsers = (await this.client.shard?.broadcastEval(
			async (client: Client, { userId: user_id }) => {
				const foundUser = client.users.cache.get(user_id);

				if (foundUser) {
					return foundUser;
				}

				return null;
			},
			{ context: { userId } },
		)) as (User | null)[] | null;

		const isCached =
			cachedUsers?.find((u) => u instanceof User) ||
			(this.client.shard ? this.client.users.cache.get(userId) : null) ||
			null;

		if (isCached) {
			return isCached;
		}

		const user = (await this.client.users.fetch(userId)) ?? null;

		return user;
	}

	/**
	 *  Get a guild by an id from all shards
	 */
	public async getGuild(id: string | null): Promise<Guild | null> {
		if (!id || !/\d+/.test(id)) return null;

		const cachedGuilds = (await this.client.shard?.broadcastEval(
			async (client: Client, { guildId }) => {
				const foundGuild = client.guilds.cache.get(guildId);

				if (foundGuild) {
					return foundGuild;
				}

				return null;
			},
			{ context: { guildId: id } },
		)) as (Guild | null)[] | null;

		const isCached =
			cachedGuilds?.find((g) => g instanceof Guild) ||
			(this.client.shard ? this.client.guilds.cache.get(id) : null) ||
			null;

		if (isCached) {
			return isCached;
		}

		const guild = (await this.client.guilds.fetch(id)) ?? null;

		return guild;
	}

	/**
	 *  Get a member by an id from all shards
	 */
	public async getMember(guild: string | null, user: string | null): Promise<GuildMember | null> {
		if (!guild || !/\d+/.test(guild)) return null;

		const userId = this.regexMention(user);

		if (!userId) return null;

		const guildObj = await this.getGuild(guild);

		if (!guildObj) return null;

		const cached = guildObj.members.cache.get(userId);

		if (cached) {
			return cached;
		}

		const member = (await guildObj.members.fetch({ user: userId })) ?? null;

		return member;
	}

	/**
	 * 	Get a channel by an id from all shards
	 */
	public async getChannel(guildId: string, channelId: string | null): Promise<GuildBasedChannel | null> {
		if (!guildId || !/\d+/.test(guildId)) return null;

		const parseChannel = this.regexChannel(channelId);

		if (!parseChannel) return null;

		const guild = await this.getGuild(guildId);

		// bruh??!?!?!?!
		if (!guild) return null;

		const channel = guild.channels.cache.get(parseChannel);

		if (channel) return channel;

		const fetchedChannel = await guild.channels.fetch(parseChannel);

		return fetchedChannel;
	}

	public async getUserDetails(interaction: Interaction) {
		const member = interaction.member as GuildMember | null;
		const user = interaction.user;

		return {
			tag: user.tag,
			icon: (member ? member : user).displayAvatarURL({ dynamic: true, size: 256 }) ?? user.defaultAvatarURL,
			username: member?.displayName ?? user.username,
			discriminator: user.discriminator,
		};
	}

	public authorSplit = "@";
	public stateSplit = ":";
	public subCommandSplit = ".";
	public buttonSplit = "-";

	/**
	 *  Get det data from the slash commandId
	 */
	public getMeta(id: string): CommandMeta | null {
		// first remove the "state"
		const [data, meta] = id.split(this.authorSplit);

		const [author, state] = meta.split(this.stateSplit);

		const [path, button] = data.split(this.buttonSplit);

		// then we get the command and subcommand path
		const [base, ...sub] = path.split(this.subCommandSplit);

		// then we get the command and subcommand
		let name = base;
		let command: Command | SubCommand | undefined = this.client._zerotwo.commands.get(base);

		// if there is no command bruh
		if (!command) return null;

		// if there is no subcommand return the command
		if (command.subCommands.size <= 0 && sub.length <= 0)
			return {
				command,
				name,
				author,
				state,
				button,
			};

		// find the subcommand
		for (const subCom of sub) {
			if (!command) break;
			name = subCom;
			command = command?.subCommands.get(subCom);
		}

		// if the path is split but when there is no subcommand return nothing
		if (!command) return null;

		// return the subcommand
		return {
			command,
			name,
			button,
			author,
			state,
		};
	}

	public addState(commandId: string | null, author: string, state?: string) {
		if (!commandId) throw new Error("CommandId is null");
		return `${commandId}${this.authorSplit}${author}${this.stateSplit}${state ?? ""}`;
	}

	public joinCommandId(command: (string | null)[], action: string) {
		if (!command) throw new Error("CommandId is null");
		return `${command.filter((c) => !!c).join(this.subCommandSplit)}${this.buttonSplit}${action}`;
	}

	public isOwner(id: string) {
		if (this.client.application?.owner instanceof Team) {
			return this.client.application.owner.members.has(id);
		}

		return this.client.application?.owner?.id === id;
	}

	public async embedTooLong(
		interaction: CommandInteraction | ButtonInteraction,
		embed: MessageEmbed,
		text: string,
		code: string | false = false,
	): Promise<unknown> {
		if (text.length < 4000) {
			return interaction.editReply({
				embeds: [embed.setDescription(code ? `\`\`\`${code}\n${Util.escapeCodeBlock(text)}\n\`\`\`` : text)],
			});
		}

		try {
			const response = await this.client._zerotwo.imperial.createDocument(text, {
				expiration: 1,
				longerUrls: true,
				language: code ? code : "plaintext",
			});

			await interaction.editReply({
				embeds: [embed.setDescription(`Content is here: <${response.link}>`)],
			});
		} catch (error: any) {
			console.error(error);
			await interaction.editReply({ embeds: [embed.setDescription(`Unkown error: ${String(error.message)}`)] });
		}
	}

	public findLowestSubCommand(
		command: CommandInteraction | Command | SubCommand,
		args?: readonly CommandInteractionOption[],
	): [Command | SubCommand, readonly CommandInteractionOption[] | undefined] | null {
		if (command instanceof CommandInteraction) {
			const com = this.client._zerotwo.commands.get(command.commandName);
			return com ? this.findLowestSubCommand(com, args) : null;
		}

		if (!command.subCommands.size) {
			return [command, args];
		}

		const sub = args?.find((a) => a.type === "SUB_COMMAND" || a.type === "SUB_COMMAND_GROUP");

		if (!sub) return [command, args];

		const subCommand = command.subCommands.get(sub.name);

		if (!subCommand) return [command, args];

		return this.findLowestSubCommand(subCommand, sub.options);
	}
}

export interface Handy {
	client: Client;
}

interface CommandMeta {
	name: string;
	command: Command | SubCommand;
	author: string;
	state: string;
	button: string;
}
