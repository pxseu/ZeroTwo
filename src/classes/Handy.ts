import { Client, Guild, GuildMember, Team, User } from "discord.js";
import { Command, SubCommand } from "./Command";

export class Handy {
	constructor(client: Client) {
		Object.defineProperty(this, "client", { value: client });
	}

	private regexMention = /^<@!?(\d{18})>$/i;
	private regexId = /^(\d{18})$/i;

	/**
	 *  Get a user by an id from all shards
	 */
	public async getUser(id: string | null): Promise<User | null> {
		const userId = this.regexMention.exec(id ?? "")?.[1] ?? this.regexId.exec(id ?? "")?.[1];

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

		const userId = this.regexMention.exec(user ?? "")?.[1] ?? this.regexId.exec(user ?? "")?.[1];

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

	public addState(commandId: string | null, author: string, state: string) {
		if (!commandId) throw new Error("CommandId is null");
		return `${commandId}${this.authorSplit}${author}${this.stateSplit}${state}`;
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
