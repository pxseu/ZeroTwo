const fetch = require("node-fetch");

const getImage = (endpoint = "") =>
	new Promise(async (resolve, reject) => {
		if (endpoint == undefined || endpoint == "") {
			return reject(new Error("No endpoint defined"));
		}

		const request = await fetch(`https://nekos.life/api/v2/img${endpoint}`);

		if (request.status != 200)
			return reject(new Error("Error while fetching data"));

		const data = await request.json();
		resolve(data);
	});

module.exports = {
	getImage,
};
