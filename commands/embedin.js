module.exports = {
    name: 'embedin',
    description: 'Embed text in specific channel',
    async execute(message, args, guildConf, serverQueue, queue, client) {
        if (message.member.roles.find(r => r.name === "Head Admin") || message.member.roles.find(r => r.name === "Mod") || message.member.roles.find(r => r.name === "OWNERS") || message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)) {
            const channelid = args[0];
            args[0] = "";
            txt = args.join(' ');
            client.channels.get(channelid).send({
                embed: {
                    color: 10181046,
                    description: txt
                }
            });
            message.delete().catch(O_o => {});
            return 0;
        } else {
            message.reply("You don't have the permision to use this command.")
            return 0;
        }
    }
}