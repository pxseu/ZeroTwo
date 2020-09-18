"use strict";

const Server = require("../models/server");
const events = require("../utils/events");

const guildStuff = (client) => {
	client.on(events.GUILDDELETE, (guild) => {
		Server.findOne({
			serverid: guild.id,
		})
			.deleteOne()
			.exec();
	});

	const completemsg = `Thank you for agreeing to the rules and code of conduct! You are now a verified member of the guild! \nFeel free to choose what roles you’d like, introduce yourself or check out a our other channels. \n\n**Your unique token is your signature that you have read and understood our rules.**\n`;

	client.on(events.GUILDMEMBERADD, async (member) => {
		const guild = await Server.findOne({
			serverid: member.guild.id,
		}).then((currentServer) => {
			if (currentServer) {
				return currentServer;
			} else {
				return 0;
			}
		});

		if (guild.verification === false) return;
		if (member.user.bot || member.guild.id !== guild.serverid) return;
		const token = shortcode(8);
		const welcomemsg = `Welcome to the server!! We hope you find a home here! Check out the \`#rules\` channel to make sure that we live, and as long as our goals are similar, then there’s a place at the table waiting for you. \n\n If you accept the code of conduct, please verify your agreement by sending a message to \`#verify-me\` with the verification phrase: \n\n\`I agree to abide by all rules. My token is ${token}.\`\n\n **This message is case-sensitive, and please include the period at the end! ** \n\nQuestions? Get at a staff member in the server or via DM.`;
		client.channels.get(guild.logchannel).send({
			embed: {
				color: 10181046,
				description: `${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`,
			},
		});
		member.send(welcomemsg);
		member.user.token = token;
	});

	const verifymsg = "I agree to abide by all rules. My token is {token}.";

	client.on(events.MESSAGE, async (message) => {
		if (
			message.author.bot ||
			!message.author.token ||
			message.channel.type == `dm`
		)
			return;
		const guild = await Server.findOne({
			serverid: message.guild.id,
		});
		if (message.content !== verifymsg.replace("{token}", message.author.token))
			return;

		await message.channel.fetchMessages("2").then((messages) => {
			message.channel.bulkDelete(messages);
		});
		message.member
			.addRole(
				message.guild.roles.find((role) => role.name === guild.roleafterver)
			)
			.then(
				client.channels.get(guild.logchannel).send({
					embed: {
						color: 10181046,
						description: `TOKEN: ${message.author.token} Role ${guild.roleafterver} added to member ${message.author.id}`,
					},
				})
			)
			.catch((e) => {
				message.author.send(
					"`There was an error adding you the role.`\n\n`Please message any online staff to resolve it.`"
				);
				return console.log(e);
			});
		//if (message.member.roles.find(r => r.name === loaderrr.roleafterver)) {
		console.log(1);
		message.member.send({
			embed: {
				color: Math.floor(Math.random() * (0xffffff + 1)),
				description: completemsg,
				timestamp: new Date(),
				footer: {
					text: `Verification Success`,
				},
			},
		});
		//}
	});

	client.on(events.GUILDMEMBERREMOVE, async function (member) {
		const guild = await Server.findOne({
			serverid: member.guild.id,
		});
		if (guild.logging == false) return;
		client.channels.get(guild.logchannel).send({
			embed: {
				color: 10181046,
				description: `a member leaves a guild, or is kicked: ${member.user.username}#${member.user.discriminator}`,
			},
		});
	});

	client.on(events.GUILDDELETE, (guild) => {
		guild.owner.send(
			`Konnichiwa ( \´ ▽ \` )\nThank you for adding me!\nType zt!help for commands.`
		);
		client.user.setActivity("with " + client.channels.cache.size + " users");
		new Server({
			serverid: guild.id,
		}).save();
	});

	/* client.on('message', async message => {
   if (message.author.bot || message.channel.type == `dm`) return;
   const loader = await Server.findOne({
      serverid: message.guild.id
   })
   if (badword.some(word => message.content.toLowerCase().includes(word))) {
      if (message.member.roles.cache.some(role => role.name == loader.adminRole)
      || message.member.roles.cache.some(role => role.name == loader.modRole)
      || message.author.id == "338718840873811979")        return;  
      message.reply({
         embed: {
            color: 10181046,
            description: "Don't use swear word my guy."
         }
      });
      
      if (loader.logging == false) return;
      client.channels.get(loader.logchannel).send({
         embed: {
            color: 10181046,
            description: `${message.author.tag} said a bad word: ` + message.content
         }
      });
   }
}) */
};

function shortcode(n) {
	const possible =
		"ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789";
	let text = "";
	for (var i = 0; i < n + 1; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

module.exports = guildStuff;
