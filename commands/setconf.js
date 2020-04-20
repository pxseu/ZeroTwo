module.exports = {
    name: 'setconf',
    description: 'set configuration for server',
    execute(message, args, guildConf, serverQueue, queue, client) {
        if (message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)) {
            const [prop, ...value] = args;
            if (!client.settings.has(message.guild.id, prop)) {
                return message.reply("This key is not in the configuration.");
            }
            client.settings.set(message.guild.id, value.join(" "), prop);
            message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);
            return 0;
        } else {
            return message.reply("You're not an admin, sorry!");
        }
    }
}