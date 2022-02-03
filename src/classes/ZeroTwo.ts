import {
	ActivityOptions,
	ButtonInteraction,
	Client,
	Collection,
	CommandInteraction,
	Interaction,
	MessageEmbed,
	MessageEmbedOptions,
} from "discord.js";
import { ACTIVITIES, DEV, DISCORD_TOKEN, IMPERIAL_TOKEN, INTENTS } from "../utils/config.js";
import { Command } from "./Command.js";
import { getCommands } from "../utils/loader.js";
import { logging } from "../utils/log.js";
import { Colors } from "./Colors.js";
import { Handy } from "./Handy.js";
import { Imperial } from "imperial.js";

export class ZeroTwo {
	constructor(noListeners = false) {
		// colors
		this.colors = new Colors();

		// set up the logger
		this.logger = logging("ZERO_TWO");

		// set a placeholder for the commands
		this.commands = new Collection<string, Command>();

		// set up the client
		this.client = new Client({ intents: !noListeners ? INTENTS : [], userAgentSuffix: ["ZeroTwo"] });

		// setupd utils
		this.handy = new Handy(this.client);

		// setup imperial
		this.imperial = new Imperial(IMPERIAL_TOKEN);

		// pass `this` to the client
		this.client._zerotwo = this;

		if (noListeners) return this;

		// set up the listeners
		this.client.on("interactionCreate", this.handleInteraction.bind(this));
	}

	private status() {
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

	private async handleInteraction(interaction: Interaction) {
		if (interaction.isCommand()) return this.handleCommand(interaction);
		if (interaction.isButton()) return this.handleButton(interaction);
	}

	private async handleCommand(interaction: CommandInteraction) {
		// get the command
		const command = this.handy.findLowestSubCommand(interaction, interaction.options.data);

		console.log(command);

		// log the command
		this.logger.log(`Recieved command '${interaction.commandName}'`);

		// if we don't have the command, ignore it
		if (!command)
			return interaction.reply({
				ephemeral: true,
				embeds: [
					this.embed({
						description: `Could not find command '${interaction.commandName}'`,
					}),
				],
			});

		// defer the reply
		await interaction.deferReply({ ephemeral: command.ephermal });

		try {
			// execute the command
			await command.execute(interaction, interaction.options.data);
		} catch (e) {
			console.error(e);
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

	private async handleButton(interaction: ButtonInteraction) {
		this.logger.log(`Recieved button '${interaction.customId}'`);

		// get the command
		const meta = this.handy.getMeta(interaction.customId);

		if (!meta) return;

		const button = meta.command.buttonInteractions.get(meta.button);

		if (!button) return;

		// defer the reply
		if (meta.command.update) {
			await interaction.deferUpdate();
		} else {
			await interaction.deferReply({ ephemeral: meta.command.ephermal });
		}

		try {
			// execute the command
			await button.execute(interaction);
		} catch (e) {
			console.error(e);
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

	// login to discord and setup the bot
	public async login() {
		// before we login let's get all the commands
		await getCommands(this.client, this.commands);

		// login to discord
		await this.client.login(DISCORD_TOKEN);

		// fetch application
		await this.client.application?.fetch();

		// status
		this.status();

		// done
		this.logger.log(`Connected as '${this.client.user!.username}#${this.client.user!.discriminator}'`);

		return this;
	}

	// destroy the bot and disconnect
	public async destroy() {
		// clear the status interval
		clearTimeout(this.statusTimeout);

		// remove all listeners
		this.client.removeAllListeners();

		// destroy the client
		this.client.destroy();

		// done
		this.logger.warn("Destroyed");

		// exit
		process.exit(0);
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
