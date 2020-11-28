import { MessageEmbed, Message } from "discord.js";
import { bypassIds } from "../utils/config";

module.exports = {
	name: "embed",
	description: "Embed an image or text",
	async execute(message: Message, args: string[]) {
		if (
			Object.keys(bypassIds).some((id) => id == message.author.id) ==
			false
		) {
			return message.reply(
				"You don't have the permission to use this command.",
			);
		}
		const option = args[0];
		args.shift();
		switch (option) {
			case "img":
			case "image":
				embedimg(message, args);
				break;
			case "txt":
			case "text":
				embedtxt(message, args);
				break;
			case "imgin":
			case "imagein":
				embedimgin(message, args);
				break;
			case "txtin":
			case "textin":
				embedtxtin(message, args);
				break;
			default:
				noOption(message);
				break;
		}
		message.delete().catch((O_o) => {});
	},
	type: 2,
};

function noOption(message: Message) {
	const embed = new MessageEmbed();
	embed.setColor("RANDOM");
	embed.setDescription(
		"Please use on of these options:\n" +
			"``img`` ``<image url>``\n" +
			"``txt`` ``<just plain text lol>``\n" +
			"``txtin`` ``<channelid>`` ``<plaintext>``\n" +
			"``imgin`` ``<channelid>`` ``<img url>``",
	);
	message.channel.send(embed);
}

function embedtxt(message: Message, args: string[]) {
	const txt = args.join(" ");
	if (txt == undefined) return message.reply("Message cannot be empty.");
	const embed = new MessageEmbed();
	embed.setColor("RANDOM");
	embed.setDescription(txt);
	message.channel.send(embed);
}

function embedimg(message: Message, args: string[]) {
	const imgurl = args.join(" ");
	if (!validURL(imgurl))
		return message.reply("This is not a valid image url!");
	const embed = new MessageEmbed();
	embed.setColor("RANDOM");
	embed.setDescription(`[Image url](${imgurl})`);
	embed.setImage(imgurl);
	message.channel.send(embed);
}

function embedtxtin(message: Message, args: string[]) {
	const channel = message.guild.channels.cache.get(args[0]);
	if (channel == undefined)
		return message.reply("Channel id cannot be empty.");
	args.shift();
	const txt = args.join(" ");
	if (txt == undefined) return message.reply("Message cannot be empty.");
	const embed = new MessageEmbed();
	embed.setColor("RANDOM");
	embed.setDescription(txt);
	//@ts-ignore
	channel.send(embed);
}

function embedimgin(message: Message, args: string[]) {
	const channel = message.guild.channels.cache.get(args[0]);
	if (channel == undefined)
		return message.reply("Channel id cannot be empty.");
	args.shift();
	const imgurl = args.join(" ");
	if (!validURL(imgurl))
		return message.reply("This is not a valid image url!");
	const embed = new MessageEmbed();
	embed.setColor("RANDOM");
	embed.setDescription(`[Image url](${imgurl})`);
	embed.setImage(imgurl);
	//@ts-ignore
	channel.send(embed);
}

function validURL(str) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" +
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
			"((\\d{1,3}\\.){3}\\d{1,3}))" +
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
			"(\\?[;&a-z\\d%_.~+=-]*)?" +
			"(\\#[-a-z\\d_]*)?$",
		"i",
	);
	return !!pattern.test(str);
}
