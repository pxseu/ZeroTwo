module.exports = {
	name: 'help',
	description: 'Halp me',
	execute(message, args) {
                const { embedhelp } = require('../config.json');
                const embed = embedhelp
                message.channel.send({ embed });
	},
};