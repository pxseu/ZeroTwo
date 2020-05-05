module.exports = {
   name: 'showconf',
   description: 'show current config',
   execute(message, args, guildConf, serverQueue, queue) {
      message.channel.send(`The following are the server's current configuration:`);
      message.channel.send({
         embed: {
            color: 10181046,
            fields: [{
                  name: "prefix",
                  value: guildConf.prefix
               },
               {
                  name: "Admin Role",
                  value: guildConf.adminRole
               },
               {
                  name: "Mod Role",
                  value: guildConf.modRole
               },
               {
                  name: "Verification",
                  value: guildConf.verification
               },
               {
                  name: "Logging",
                  value: guildConf.logging
               },
               {
                  name: "Role After Verification",
                  value: guildConf.roleafterver
               },
               {
                  name: "Logging Channel",
                  value: guildConf.logchannel
               }
            ]
         }
      })
   }
}
