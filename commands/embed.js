const { MessageEmbed } = require('discord.js');
const { bypassIds } = require('../config.json');

module.exports = {
	name: 'embed',
	description: 'Embed an image or text',
	async execute(message, args, guildConf) {
		if (
			message.member.roles.cache.some(
				(role) => role.name == guildConf.adminRole
			) ||
			message.member.roles.cache.some(
				(role) => role.name == guildConf.modRole
			) ||
			bypassIds.some((id) => id == message.author.id)
		) {
			const option = args[0];
			args.shift();
			switch (option) {
				case 'img':
				case 'image':
					embedimg(message, args);
					break;
				case 'txt':
				case 'text':
					embedtxt(message, args);
					break;
				case 'imgin':
				case 'imagein':
					embedimgin(message, args);
					break;
				case 'txtin':
				case 'textin':
					embedtxtin(message, args);
					break;
				default:
					noOption(message);
					break;
			}
		} else {
			message.reply("You don't have the permision to use this command.");
		}
		message.delete().catch((O_o) => {});
	},
	type: 2,
};

function noOption(message) {
	const embed = new MessageEmbed();
	embed.setColor('RANDOM');
	embed.setDescription(
		'Please use on of these options:\n' +
			'``img`` ``<image url>``\n' +
			'``txt`` ``<just plain text lol>``\n' +
			'``txtin`` ``<channelid>`` ``<plaintext>``\n' +
			'``imgin`` ``<channelid>`` ``<img url>``'
	);
	message.channel.send(embed);
}

function embedtxt(message, args) {
	txt = args.join(' ');
	if (txt == undefined) return message.reply('Message cannot bee empty.');
	const embed = new MessageEmbed();
	embed.setColor('RANDOM');
	embed.setDescription(txt);
	message.channel.send(embed);
}

function embedimg(message, args) {
	imgurl = args.join(' ');
	if (!validURL(imgurl)) return message.reply('This is not a valid image url!');
	const embed = new MessageEmbed();
	embed.setColor('RANDOM');
	embed.setDescription(`[Image url](${imgurl})`);
	embed.setImage(imgurl);
	message.channel.send(embed);
}

function embedtxtin(message, args) {
	const channel = message.guild.channels.cache.get(args[0]);
	if (channel == undefined) return message.reply('Channel id cannot be empty.');
	args.shift();
	txt = args.join(' ');
	if (txt == undefined) return message.reply('Message cannot be empty.');
	const embed = new MessageEmbed();
	embed.setColor('RANDOM');
	embed.setDescription(txt);
	channel.send(embed);
}

function embedimgin(message, args) {
	const channel = message.guild.channels.cache.get(args[0]);
	if (channel == undefined) return message.reply('Channel id cannot be empty.');
	args.shift();
	imgurl = args.join(' ');
	if (!validURL(imgurl)) return message.reply('This is not a valid image url!');
	const embed = new MessageEmbed();
	embed.setColor('RANDOM');
	embed.setDescription(`[Image url](${imgurl})`);
	embed.setImage(imgurl);
	channel.send(embed);
}

function validURL(str) {
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$',
		'i'
	);
	return !!pattern.test(str);
}
