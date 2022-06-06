import { GuildMember, Interaction } from "discord.js";

interface UserDetails {
	tag: string;
	icon: string;
	username: string;
	discriminator: string;
}

export const getUserDetails = async (interaction: Interaction): Promise<UserDetails> => {
	const member = interaction.member as GuildMember | null;
	const user = interaction.user;

	return {
		tag: user.tag,
		icon: (member ? member : user).displayAvatarURL({ dynamic: true, size: 256 }) ?? user.defaultAvatarURL,
		username: member?.displayName ?? user.username,
		discriminator: user.discriminator,
	};
};
