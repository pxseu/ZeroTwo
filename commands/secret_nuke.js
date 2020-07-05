const { default: Axios } = require("axios");

module.exports = {
    name: 'secret_nuke',
    description: 'Nuke some hoes',
    execute(message, args) {
        if (args < 1) return message.channel.send("No url set!");
        let url = args[0];
        if (validURL(url) == false) return message.channel.send("Invalid url set!");
        let i = 0;
        let interval = setInterval(()=>{
            if (i > 499) {
                clearInterval(interval);
                return message.reply(`Nuke done for \<${url}\> with ${i} requests.`)
            }
            i++;
            Axios.get(url, { headers: { 'User-Agent': 'fuk yo ip logger' }})
            // 
        }, 500)
    }
}
 
function validURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}