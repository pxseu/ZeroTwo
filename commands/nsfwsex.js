const { MessageEmbed } = require("discord.js");
const getImage = require("../utils/getImage");

module.exports = {
	name: "sex",
	description: "Sex someone!",
	async execute(message, args) {
		const goodEndPoints = ["/classic", "/Random_hentai_gif"];
		const sex = await getImage(
			goodEndPoints[Math.floor(Math.random() * goodEndPoints.length)]
		);

		const tagged =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(r) =>
					r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
			) ||
			message.guild.members.cache.find(
				(ro) =>
					ro.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
			);
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");

		if (tagged == undefined || tagged.id == message.author.id) {
			embed.setDescription(`Hot sex scene 😳`);
			embed.setImage(sex.url);
			message.channel.send(embed);
		} else {
			const confEmbed = new MessageEmbed();
			confEmbed.setDescription(
				`Do you want to have sex with <@${message.author.id}>, <@${tagged.id}>?`
			);
			confEmbed.setColor("RANDOM");
			message.channel.send(confEmbed).then((confmsg) => {
				const filter = (msg) => tagged.id == msg.author.id;
				message.channel
					.awaitMessages(filter, { max: 1, time: 20000 })
					.then((collected) => {
						if (!collected.first()) return;
						if (!collected.first().deleted) collected.first().delete();
						if (collected.first().content.toLowerCase() == "yes") {
							embed.setDescription(
								`<@${message.author.id}> fucks <@${tagged.id}> hard 😳`
							);
							embed.setImage(sex.url);
							message.channel.send(embed);
						} else if (collected.first().content.toLowerCase() == "no") {
							embed.setDescription(`<@${tagged.id}> didn't consent!`);
							message.channel.send(embed);
						}
					});
				if (!confmsg.deleted) confmsg.delete();
			});
		}
		if (!message.deleted) message.delete();
	},
	type: 5,
	aliases: ["fuck"],
};
