import fetch, { Response } from "node-fetch";
import { DEV_MODE } from "..";
import { endpoitsForApis, endpoitFileds } from "./config";
import { messageCreator } from "./guildStuff";

type RequestData = {
	url: string;
	api: string;
};
type Endpoints =
	/* SFW */
	"/fox" | "/kiss" | "/hug" | "/gecg" | "/neko" | "/pat" | "/slap";

const getImage = (endpoint: Endpoints) =>
	new Promise<RequestData>(async (resolve, reject) => {
		if (endpoint == undefined) {
			return reject(new Error("No endpoint defined!"));
		}
		let randomEndpoint: string,
			randomApi: string,
			request: Response,
			reqdata: RequestData,
			loopCounter = 0,
			isError = false;

		do {
			if (Object.keys(endpoitsForApis).some((ep) => ep == endpoint)) {
				const cep = Object.keys(endpoitsForApis[endpoint]);
				randomApi = cep[Math.floor(Math.random() * cep.length)];
				const avlbep = endpoitsForApis[endpoint][randomApi];
				randomEndpoint =
					avlbep[Math.floor(Math.random() * avlbep.length)];
			}
			if (randomApi == undefined || randomElement == undefined) {
				return reject(new Error("Endpoint is not found!"));
			}

			DEV_MODE ? console.log(">>> ", randomApi, randomEndpoint) : void 0;

			try {
				request = await fetch(`${randomApi}${randomEndpoint}`);
				reqdata = await request.json();
			} catch (e) {
				messageCreator(
					`Api: [${randomApi}]() has failed with endpoint: ${randomEndpoint}!`,
					true,
				);
			}

			isError =
				request.status != 200 ||
				reqdata == undefined ||
				(reqdata[endpoitFileds[randomApi]] as string) == undefined;

			if (isError)
				messageCreator(
					`Api: [${randomApi}]() has failed with endpoint: ${randomEndpoint}!`,
					true,
				);
		} while (isError && loopCounter <= 5);

		if (isError) return reject(new Error("Error while fetching data"));

		resolve({
			url: reqdata[endpoitFileds[randomApi]] as string,
			api: randomApi,
		});
	});

const randomElement = (array: any[]) =>
	array[Math.floor(Math.random() * array.length)];

export { getImage, randomElement };
