module.exports = {
    name: 'assign',
    description: 'Assign a role',
    execute(message, args) {
        if (args < 1) return message.channel.send({
            embed: {
                title: "Assign a role.",
                description: "``You can assign the roles by p!assign [roleName]``"
            }
        })

        const mentioned = message.mentions.members.first();
        let userToAddRole = message.member;

        if (mentioned != undefined){
            if (args[0].startsWith("<@") && args[0].endsWith(">")){
                args.shift();
                userToAddRole = mentioned;
            }
        }

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Insufficient permissions.")
        
        const query = args.join(" ");

        const role = message.guild.roles.cache.find(r => r.name == query);

        if(!role) return message.channel.send("Role doesen't exist."); 

        if (userToAddRole.roles.cache.find(r => r.name == role.name)) {
            message.channel.send("User aleady has the role.")
            message.react("❌");
        } else {
            userToAddRole.roles.add(role.id);
            message.react("✔")
            message.channel.send("Added role to user.")
        }
    }
};