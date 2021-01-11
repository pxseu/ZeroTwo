module.exports = {
	name: "links",
	description: "Links to my stuff!",
	execute(message) {
		message.info(
			"My Website: [https://www.pxseu.com](https://www.pxseu.com) ✨\n" +
				"My bot: [https://github.com/pxseu/ZeroTwoBot](https://github.com/pxseu/ZeroTwoBot) 😳"
		);
	},
	type: 0,
	aliases: ["link", "website", "homepage"],
} as Command;
