module.exports = {
    name: 'setconf',
    description: 'set configuration for server',
    async execute(message, args, guildConf, serverQueue, queue, client, Server) {
        if (message.member.roles.find(r => r.name === guildConf.adminRole) || message.member.roles.find(r => r.name === guildConf.modRole)) {
            const [prop, ...value] = args;
            const confName = value.join(" ")
            console.log(prop, confName)
            switch (prop) {
                case 'prefix':
                    await Server.updateOne({ serverid : message.guild.id }, {  prefix : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to:\`${value.join(" ")}\``);            
                case 'logchannel':
                    await Server.updateOne({ serverid : message.guild.id }, {  logchannel : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to: \`${value.join(" ")}\``);            
                case 'roleafterver':
                    await Server.updateOne({ serverid : message.guild.id }, {  roleafterver : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to: \`${value.join(" ")}\``);            
                case 'adminRole':
                    await Server.updateOne({ serverid : message.guild.id }, {  adminRole : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to: \`${value.join(" ")}\``);            
                case 'modRole':
                    await Server.updateOne({ serverid : message.guild.id }, {  modRole : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to: \`${value.join(" ")}\``);            
                case 'verification':
                    await Server.updateOne({ serverid : message.guild.id }, {  verification : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to: \`${value.join(" ")}\``);            
                case 'logging':
                    await Server.updateOne({ serverid : message.guild.id }, {  verification : confName });
                    return message.channel.send(`Guild configuration item ${prop} has been changed to: \`${value.join(" ")}\``);            
                default:
                    return message.channel.send(`Unable to find item \`${prop}\``);          
            }
        } else {
            return message.reply("You're not an admin, sorry!");
        }
    }
}

