module.exports = {
	name: "play",
	description: "Play song!",
	async execute(message, args) {
		const name = args.join(" ");
		if (!name) {
			message.error("You didn't provide any song name!");
			return;
		}

		const voice = message.member.voice.channel;
		if (!voice) {
			message.error("You're not in a voice channel!");
			return;
		}

		const perms = voice.permissionsFor(message.client.user);
		if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
			message.error("I don't have the permission to connect or speak!");
			return;
		}

		await message.client.player.play(message, args.join(" "), true);
	},
	type: 4,
	aliases: ["p", "zapusc-melodie", "zapodaj-bita"],
} as Command;
