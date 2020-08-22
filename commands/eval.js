const { bypassIds } = require("../config.json"); //message.author.id != ownerid

module.exports = {
    name: 'eval',
    description: `Dev Eval (special peeps (${bypassIds.join(", ")}))`,
    execute(message, args) {
      if (bypassIds.some(id => id == message.author.id)) {
        try {
          const code = args.join(" ");
          let evaled = eval(code);
      
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
      } else {
        message.channel.send('This command is for the owner only.');
      }
    },
    type: 0
};

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}