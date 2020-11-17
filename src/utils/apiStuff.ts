import fetch from "node-fetch";
import { endpoitsForApis } from "./config";

type RequestData = {
	url: string;
	api: string;
};
type Endpoints =
	/* SFW */
	| "/fox"
	| "/kiss"
	| "/hug"
	| "/gecg"
	| "/neko"
	| "/pat"
	| "/slap"
	/* NSFW WRRRR */
	| "/boobs"
	| "/cum"
	| "/classic";

const getImage = (endpoint: Endpoints) =>
	new Promise<RequestData>(async (resolve, reject) => {
		if (endpoint == undefined) {
			return reject(new Error("No endpoint defined"));
		}
		let randomEndpoint = endpoint.toString();
		let randomApi = "https://nekos.life/api/v2/img";

		if (Object.keys(endpoitsForApis).some((ep) => ep == endpoint)) {
			const cep = Object.keys(endpoitsForApis[endpoint]);
			randomApi = cep[Math.floor(Math.random() * cep.length)];
			const avlbep = endpoitsForApis[endpoint][randomApi];
			randomEndpoint = avlbep[Math.floor(Math.random() * avlbep.length)];
		}

		const request = await fetch(`${randomApi}${randomEndpoint}`);

		let data: RequestData = await request.json();

		if (request.status != 200 || data == undefined || data.url == undefined)
			return reject(new Error("Error while fetching data"));
		data.api = randomApi;
		resolve(data);
	});

const randomElement = (array: any[]) =>
	array[Math.floor(Math.random() * array.length)];

export { getImage, randomElement };
