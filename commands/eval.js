const { ownerid } = require("../config.json");

module.exports = {
    name: 'eval',
    description: 'Dev Eval',
    execute(message, args) {
        if (message.author.id != ownerid) return message.channel.send('This command is for the owner only.');
        try {
            const code = args.join(" ");
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
            message.channel.send(clean(evaled), {code:"xl"});
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
    },
    type: 0
};