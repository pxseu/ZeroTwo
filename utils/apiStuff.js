"use strict";

const fetch = require("node-fetch");

const getImage = (endpoint = "") =>
	new Promise(async (resolve, reject) => {
		if (endpoint == undefined || endpoint == "") {
			return reject(new Error("No endpoint defined"));
		}

		const request = await fetch(`https://nekos.life/api/v2/img${endpoint}`);

		const data = await request.json();

		if (request.status != 200 || data == undefined || data.url == undefined)
			return reject(new Error("Error while fetching data"));

		resolve(data);
	});

module.exports = {
	getImage,
};
