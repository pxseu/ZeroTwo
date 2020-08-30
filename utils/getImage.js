const fetch = require("node-fetch");

async function getImage(endpoint = "") {
	if (endpoint == undefined || endpoint == "") {
		throw new Error("No endpoint defined");
	}

	return await fetch(`https://nekos.life/api/v2/img${endpoint}`).then((res) =>
		res.json()
	);
}

module.exports = getImage;
