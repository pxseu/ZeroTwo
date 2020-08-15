const { MessageEmbed } = require('discord.js');
const api = require('genius-api');
const genius = new api(process.env.GENIUS_TOKEN);

module.exports = {
    name: "lyricsspotify",
    description: "Show lyrics to the spotufy song you're listening.",
    async execute(message, args) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

        if (!user.presence.activities.length) {
            const embed = new MessageEmbed()
                .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                .setColor("GREEN")
                .setThumbnail(user.user.displayAvatarURL())
                .addField("**No song playing on spotify!**", 'You or this user is not playing any song!')
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp()
            message.channel.send(embed)
            return;
        }
        user.presence.activities.forEach((activity) => {
            if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {
                let trackName = activity.details;
                let trackAuthor = activity.state;
                trackAuthor = trackAuthor.replace(/;/g, " ");
  
                genius.search(`${trackName} by ${trackAuthor}`).then((response)=> {
                    let descriptionFunsies = "";
                    if (response.hits == undefined || response.hits.length === 0){
                        descriptionFunsies = "No song found!";
                    } else {
                        console.log(response.hits)
                        let loopCount = 0;
                        for (const result of response.hits) {
                            if (loopCount == 5) break;
                            loopCount++;
                            descriptionFunsies += `**[${
                                result.result.full_title
                            }](${result.result.url})**`;
                            descriptionFunsies += "\n\n";
                        }
                    }
                    
                    const embed = new MessageEmbed()
                        .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                        .setColor("RANDOM")
                        .setThumbnail(user.user.displayAvatarURL())
                        .setTitle("**Results:**")
                        .setDescription(descriptionFunsies)
                        .setFooter(message.guild.name, message.guild.iconURL())
                        .setTimestamp()
                    return message.channel.send(embed);
                })

            }
        })
        const embed = new MessageEmbed()
            .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
            .setColor("GREEN")
            .setThumbnail(user.user.displayAvatarURL())
            .addField("**No song playing on spotify!**", 'You or this user is not playing any song!')
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
        message.channel.send(embed)
    },
    type: 4
}