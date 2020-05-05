module.exports = {
	name: 'owner',
	description: 'Owner!',
	execute(message, args) {
		message.channel.send({embed: {color: 10181046, title:"My owner is pxseu#6944", description: "[OWNERS WEBSITE](https://pxseu.cc)" }});
	},
};