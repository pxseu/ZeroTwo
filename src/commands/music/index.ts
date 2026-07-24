import { Command, Context, IntegrationType } from "../../classes/Command.js";

export default class Music extends Command {
	public description = "Play music in a voice channel";
	public contexts = [Context.GUILD];
	public integrationTypes = [IntegrationType.GUILD_INSTALL];
}
