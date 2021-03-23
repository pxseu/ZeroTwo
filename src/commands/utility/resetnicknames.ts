import { bypassIds } from "../../utils/config";

module.exports = {
	name: "resetnick",
	description: "aaaaaaaa",
	async execute(message) {
		if (
			!(
				Object.keys(bypassIds).some((id) => id == message.author.id) ||
				message.member.hasPermission("CHANGE_NICKNAME")
			)
		) {
			message.info("You don't have the permission to use this command.");
			return;
		}
		try {
			let failedMembers = 0;
			const members = await message.guild.members.fetch();

			for (const member of members.array().filter((gm) => gm.nickname)) {
				if (member)
					try {
						await member.setNickname(null);
					} catch (error) {
						failedMembers++;
					}
			}

			message.info(`Done. \nFailed for ${failedMembers} user(s)`);
		} catch (e) {
			message.error("Failed to fetch members.");
		}
	},
	type: 1,
	aliases: ["resetnicknames"],
} as Command;
