module.exports = {
	name: 'pat',
	description: 'Pats!',
	execute(message, args) {
                 const { patgifs } = require('../config.json');
		 var pat = patgifs[Math.floor(Math.random() * patgifs.length)];
                 message.channel.send({embed: {color: 10181046, title:"Pats with love have been sent by "+message.author.username+".", image:  {url: pat}}});
	},
};