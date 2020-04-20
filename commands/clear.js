module.exports = {
	name: 'clear',
	description: 'clear channel',
	async execute(message, args, guildConf) {
		if(message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)){
			const bruh = message.content.split(' ').slice(1);
			const amount = bruh.join(' ');
			if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!');
			if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!');
 			if (amount > 200) return message.reply('You can`t delete more than 100 messages at once!');
			if (amount < 1) return message.reply('You have to delete at least 1 message!');
			await message.channel.fetchMessages({ limit: amount }).then(messages => {
				message.channel.bulkDelete(messages
			)});
		return 0;
      		} else {
		message.reply("You don't have the permision to use this command.")
		return 0;
		}
	},
};      
       