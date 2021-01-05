module.exports = {
	name: "owner",
	description: "Owner!",
	async execute(message) {
		const app = await message.client.fetchApplication();
		const owner = await message.client.users.fetch(app.owner.id);

		message.info(`My owner is \`${clean(owner.tag)}\` (${owner.id})`);
	},
	type: 0,
	aliases: [],
} as Command;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}
