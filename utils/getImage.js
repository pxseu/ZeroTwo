const fetch = require('node-fetch');

async function getImage(endpoint = '') {
	return await fetch(`https://nekos.life/api/v2/img${endpoint}`).then((res) =>
		res.json()
	);
}

module.exports = getImage;
