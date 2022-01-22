import { ActivityOptions, Client, Collection, Interaction, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { ACTIVITIES, DEV, DEV_GUILD, DISCORD_TOKEN, intents } from "../utils/config.js";
import { Command } from "./Command.js";
import { getCommands } from "../utils/loader.js";
import { logging } from "../utils/log.js";
import { publish, unpublish } from "../utils/publish.js";
import { Colors } from "./Colors.js";

export class ZeroTwo {
	constructor() {
		// colors
		this.colors = new Colors();

		// set up the logger
		this.logger = logging("ZERO_TWO");

		// set a placeholder for the commands
		this.commands = new Collection<string, Command>();

		// set up the client
		this.client = new Client({ intents, userAgentSuffix: ["ZeroTwo"] });

		// pass `this` to the client
		this.client._zerotwo = this;

		// set up the listeners
		this.client.on("interactionCreate", this.handleInteraction.bind(this));

		// stuff for the main worker
		process.on("message", async (message) => {
			// if we get a message, it's a command
			this.logger.log(`Recieved message '${JSON.stringify(message)}'`);

			switch (message) {
				case "publishCommands": {
					this.logger.log(
						"Publishing commands to application:",
						this.client.application?.id,
						DEV_GUILD ? `in guild ${DEV_GUILD}` : "",
					);

					try {
						// publish the commands
						await publish(this.client.application!.id, Array.from(this.commands.values()), DEV_GUILD);

						this.logger.log("Published commands successfully");
					} catch (e) {
						this.logger.error("Error whilst publishing commands", e);
					}

					break;
				}

				case "unpublishCommands": {
					if (!DEV_GUILD) return;

					this.logger.log(
						"Unpublishing commands from application:",
						this.client.application?.id,
						"in guild",
						DEV_GUILD,
					);

					try {
						// unpublish the commands
						await unpublish(this.client.application!.id, DEV_GUILD);

						this.logger.log("Unpublished commands successfully");
					} catch (e) {
						this.logger.error("Error whilst unpublishing commands", e);
					}
				}
			}
		});
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
		// for now we only care about commands
		if (!interaction.isCommand()) return;

		// get the command
		const command = this.commands.get(interaction.commandName);

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
			await interaction.reply({
				ephemeral: true,
				embeds: [
					this.embed({
						description: `Failed while executing command '${interaction.commandName}'`,
					}),
				],
			});
		}
	}

	// login to discord and setup the bot
	public async login() {
		// before we login let's get all the commands
		this.commands = await getCommands(this.client);

		// login to discord
		await this.client.login(DISCORD_TOKEN);

		// status
		this.status();

		// done
		this.logger.log(`Connected as '${this.client.user!.username}#${this.client.user!.discriminator}'`);
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
	commands: Collection<string, Command>;
	logger: ReturnType<typeof logging>;
	statusTimeout: NodeJS.Timeout;
}
