import { Error } from "mongoose";
import fetch from "node-fetch";

type RequestData = {
	url: string;
};

const getImage = (endpoint = "") =>
	new Promise<RequestData>(async (resolve, reject) => {
		if (endpoint == undefined || endpoint == "") {
			return reject(new Error("No endpoint defined"));
		}

		const request = await fetch(`https://nekos.life/api/v2/img${endpoint}`);

		const data: { url: string } = await request.json();

		if (request.status != 200 || data == undefined || data.url == undefined)
			return reject(new Error("Error while fetching data"));

		resolve(data);
	});

const randomElement = (array: any[]) =>
	array[Math.floor(Math.random() * array.length)];

export { getImage, randomElement };
