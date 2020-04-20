module.exports = {
    name: 'showconf',
    description: 'show current config',
    execute(message, args, guildConf, serverQueue, queue) {
        let configProps = Object.keys(guildConf).map(prop => {
            return `${prop}  :  ${guildConf[prop]}\n`;
        });
        message.channel.send(`The following are the server's current configuration: \`\`\`${configProps}\`\`\``);
    }
}