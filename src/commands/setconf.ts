import { MessageEmbed, Message, Client } from "discord.js";
import { bypassIds } from "../utils/config";

module.exports = {
	name: "setconf",
	description: "set configuration for server",
	async execute(
		message: Message,
		args: string[],
		guildConf: any,
		_,
		Server: any,
	) {
		if (
			message.member.roles.cache.some(
				(role) => role.name == guildConf.adminRole,
			) ||
			message.member.roles.cache.some(
				(role) => role.name == guildConf.modRole,
			) ||
			bypassIds.some((id) => id == message.author.id)
		) {
			const [prop, ...value] = args;
			const confName = value.join(" ");
			console.log(prop, confName);
			switch (prop) {
				case "prefix":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							prefix: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to:\`${value.join(
							" ",
						)}\``,
					);
				case "logchannel":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							logchannel: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to: \`${value.join(
							" ",
						)}\``,
					);
				case "roleafterver":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							roleafterver: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to: \`${value.join(
							" ",
						)}\``,
					);
				case "adminRole":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							adminRole: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to: \`${value.join(
							" ",
						)}\``,
					);
				case "modRole":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							modRole: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to: \`${value.join(
							" ",
						)}\``,
					);
				case "verification":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							verification: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to: \`${value.join(
							" ",
						)}\``,
					);
				case "logging":
					await Server.updateOne(
						{
							serverid: message.guild.id,
						},
						{
							logging: confName,
						},
					);
					return message.channel.send(
						`Guild configuration item ${prop} has been changed to: \`${value.join(
							" ",
						)}\``,
					);
				default:
					return message.channel.send(
						`Unable to find item \`${prop}\``,
					);
			}
		} else {
			return message.reply("You're not an admin, sorry!");
		}
	},
	type: 0,
};