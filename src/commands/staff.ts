import { MessageEmbed } from "discord.js";
import botStaff, { botStaffType } from "../models/botStaff";
import { embedColor, embedColorError } from "../utils/config";

module.exports = {
	name: "staff",
	description: "Manage staff.",
	async execute(message, args) {
		message.react("❌");
		return;

		const cuStaff = (await botStaff.findOne({
			id: message.author.id,
		})) as botStaffType;

		const embed = new MessageEmbed();
		embed.setThumbnail(message.client.user.avatarURL({ dynamic: true }));
		embed.setFooter(`You're pretty!`);
		embed.setAuthor(
			message.member.user.username,
			message.member.user.avatarURL({ dynamic: true })
		);
		embed.setTimestamp();

		if (args.length < 1) {
			const staff = await botStaff.find();

			let desc = `Staff count: ${staff.length}`;
			desc +=
				cuStaff != null
					? `\nCurrent role: ${cuStaff.role}\nPermission level: ${cuStaff.permLvl}`
					: "";

			embed.setDescription(desc);
			embed.setColor(embedColor);
			message.channel.send(embed);
			return;
		}

		if (cuStaff == null) {
			embed.setDescription("Not allowed!");
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}

		if (cuStaff.permLvl < 10) {
			embed.setDescription(`Your permission level: ${cuStaff.permLvl} is too low!`);
			embed.setColor(embedColorError);
			message.channel.send(embed);
			return;
		}

		const mode = args[0].toLowerCase();
		args.shift();

		switch (mode) {
			case "add":
				{
					const id = args[0],
						permLvl = args[1];
					args.shift();
					args.shift();
					new botStaff({
						id,
						permLvl,
						role: args.join(" "),
					}).save();
				}
				break;

			case "remove":
				{
					/* const id = args[1]; */
				}
				break;
			default:
				break;
		}
	},
	type: 0,
} as Command;
