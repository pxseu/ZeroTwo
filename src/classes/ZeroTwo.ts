import {
	ActivityOptions,
	ButtonInteraction,
	Client,
	Collection,
	CommandInteraction,
	Interaction,
	MessageEmbed,
	MessageEmbedOptions,
	Options,
} from "discord.js";
import { ACTIVITIES, DEV, DISCORD_BOT_VERSION, DISCORD_TOKEN, IMPERIAL_TOKEN, INTENTS } from "../utils/config.js";
import { Command } from "./Command.js";
import { getCommands } from "../utils/loader.js";
import { logging } from "../utils/log.js";
import { Colors } from "./Colors.js";
import { Handy } from "./Handy.js";
import { Imperial } from "imperial.js";
import axios from "axios";

/**
 *  The ZeroTwo class is the main class of the bot.
 *  It is responsible for handling all the events and interactions.
 *  It also contains all the commands.
 *  @class
 */
export class ZeroTwo {
	constructor() {
		// set up the logger
		this.logger = logging("ZERO_TWO");

		// set up the client
		this.logger.log("Setting up");

		// colors
		this.colors = new Colors();

		// set a placeholder for the commands
		this.commands = new Collection<string, Command>();

		// set up the client
		this.client = new Client({
			intents: INTENTS,
			userAgentSuffix: ["ZeroTwo"],
			sweepers: {
				messages: {
					interval: 43200,
					lifetime: 21600,
				},
			},
			makeCache: Options.cacheWithLimits({
				MessageManager: 25,
				UserManager: 200,
			}),
		});

		// setupd utils
		this.handy = new Handy(this.client);

		// setup imperial
		this.imperial = new Imperial(IMPERIAL_TOKEN);

		// pass `this` to the client
		this.client._zerotwo = this;

		// set up the listeners
		this.client.on("interactionCreate", this._handleInteraction.bind(this));
		this.client.on("shardReady", this._shardReady.bind(this));
		this.client.on("warn", this.logger.warn);
		this.client.on("error", this.logger.error);
		// if (DEV) this.client.on("debug", logging("debug").log);
	}

	private _shardReady(shardId: number): void {
		this.logger = logging(`${this.logger.label}-${shardId}`);

		// bruih
		if (this.statusTimeout) clearTimeout(this.statusTimeout);
		this._status();
	}

	/**
	 *  Handles interaction creation.
	 */
	private async _handleInteraction(interaction: Interaction): Promise<void> {
		switch (interaction.type) {
			case "APPLICATION_COMMAND":
				return this._handleCommand(interaction as CommandInteraction);

			case "MESSAGE_COMPONENT":
				return this._handleButton(interaction as ButtonInteraction);
		}
	}

	/**
	 *  Handles a command interaction.
	 */
	private async _handleCommand(interaction: CommandInteraction): Promise<void> {
		// get the command
		const metadata = this.handy.findLowestSubCommand(interaction, interaction.options.data);

		// log the command
		this.logger.log(`Recieved command '${interaction.commandName}'`);

		// if we don't have the command, ignore it
		if (!metadata)
			return interaction.reply({
				ephemeral: true,
				embeds: [
					this.embed({
						description: `Could not find command '${interaction.commandName}'`,
					}),
				],
			});

		const [command, args] = metadata;

		// defer the reply
		await interaction.deferReply({ ephemeral: command.ephermal });

		try {
			// execute the command
			await command.execute(interaction, args);
		} catch (e) {
			if (e instanceof Error) this.logger.error(`Exception: In command '${command.name}' with`, e);

			await interaction.editReply({
				embeds: [
					this.embed({
						color: this.colors.toNumber("red"),
						description: `Failed while executing command '${interaction.commandName}'`,
					}),
				],
			});
		}
	}

	/**
	 *  Handles a button interaction.
	 */
	private async _handleButton(interaction: ButtonInteraction): Promise<void> {
		this.logger.log(`Recieved button '${interaction.customId}'`);

		// get the command
		const meta = this.handy.getMeta(interaction.customId);

		if (!meta) return;

		const button = meta.command.buttonInteractions.get(meta.button);

		if (!button) return;

		// defer the reply
		if (button.update) {
			await interaction.deferUpdate();
		} else {
			await interaction.deferReply({ ephemeral: meta.command.ephermal });
		}

		try {
			// execute the command
			await button.execute(interaction);
		} catch (e) {
			this.logger.error(e);
			await interaction.editReply({
				embeds: [
					this.embed({
						color: this.colors.toNumber("red"),
						description: `Failed while executing buttonInteraction '${interaction.customId}'`,
					}),
				],
			});
		}
	}

	/**
	 *  Updates the bot status
	 */
	private _status() {
		const setStatus = (activity: ActivityOptions) => {
			this.client.user?.setPresence({
				status: "dnd",
				activities: [activity],
			});
		};

		if (DEV) {
			return setStatus({ type: "WATCHING", name: "development 🤖" });
		}

		let iterator = 0;

		const updateStatus = async () => {
			setStatus(await ACTIVITIES[iterator](this.client));
			iterator = iterator >= ACTIVITIES.length - 1 ? 0 : iterator + 1;
			this.statusTimeout = setTimeout(updateStatus, 15_000);
		};

		updateStatus();
	}

	/**
	 *  Load commands
	 */
	public async loadCommands(): Promise<this> {
		this.logger.log("Loading commands");

		// get the commands
		await getCommands(this.client, this.commands);

		// log the commands
		this.logger.log("Loaded", this.commands.size, "commands");

		return this;
	}

	/**
	 * 	Login to discord and setup the bot
	 *  @returns the client
	 */
	public async login(): Promise<this> {
		const start = process.uptime();

		this.logger.log("Logging in");

		// before we login let's get all the commands
		await this.loadCommands();

		// login to discord
		await this.client.login(DISCORD_TOKEN);

		// fetch application
		await this.client.application?.fetch();

		const time = process.uptime() - start;

		// done
		this.logger.log(
			`Connected as '${this.client.user!.username}#${this.client.user!.discriminator}' in ${(time * 1000).toFixed(
				2,
			)}ms`,
		);

		return this;
	}

	/**
	 *  Destroy the bot and disconnect
	 *  @returns void
	 */
	public async destroy(): Promise<void> {
		// clear the status interval
		clearTimeout(this.statusTimeout);

		// remove all listeners
		this.client.removeAllListeners();

		// destroy the client
		this.client.destroy();

		// done
		this.logger.warn("Destroyed");
	}

	// create a basic embed
	public embed(data: MessageEmbedOptions) {
		return new MessageEmbed({
			color: this.colors.pink,
			timestamp: Date.now(),
			footer: {
				text: this.client.user!.tag,
				icon_url: this.client.user!.avatarURL() ?? this.client.user!.defaultAvatarURL,
			},
			...data,
		});
	}

	public axios = axios.create({
		headers: {
			"Content-Type": "application/json",
			"User-Agent": `ZeroTwo ${DISCORD_BOT_VERSION}`,
		},
	});
}

export interface ZeroTwo {
	colors: Colors;
	client: Client;
	handy: Handy;
	imperial: Imperial;
	commands: Collection<string, Command>;
	logger: ReturnType<typeof logging>;
	statusTimeout: NodeJS.Timeout;
}
