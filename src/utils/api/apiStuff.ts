import fetch from "./fetchWrapper";
import { Response } from "node-fetch";
import { DEV_MODE } from "../config";
import { endpoitsForApis, endpoitFileds } from "../config";
import { messageCreator } from "../bot/logMessage";

type RequestData = {
	url: string;
	api: string;
};

type Endpoints =
	/* SFW */
	"/fox" | "/kiss" | "/hug" | "/gecg" | "/neko" | "/pat" | "/slap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const randEl = (array: any[]) => array[Math.floor(Math.random() * array.length)];

const getEp = (endpoint: Endpoints): [string, string] => {
	const cep = Object.keys(endpoitsForApis[endpoint]);
	const randomApi = randEl(cep);
	const avlbep = endpoitsForApis[endpoint][randomApi];
	const randomEndpoint = randEl(avlbep);

	return [randomApi, randomEndpoint];
};

const parseApiUrl = (urlStr: string) => {
	const url = new URL(urlStr);
	return `${url.protocol}//${url.hostname}`;
};

interface returnData {
	url: string;
	api: string;
}

const getImage = async (endpoint: Endpoints): Promise<returnData> => {
	if (endpoint == undefined) throw "No endpoint defined!";

	if (!Object.keys(endpoitsForApis).some((ep) => ep == endpoint)) throw "Endpoint is not found!";

	let randomEndpoint: string,
		randomApi: string,
		request: Response,
		reqdata: RequestData,
		loopCounter = 0,
		isError = false;

	do {
		[randomApi, randomEndpoint] = getEp(endpoint);

		try {
			request = await fetch(`${randomApi}${randomEndpoint}`);
			reqdata = await request.json();

			isError =
				request.status != 200 ||
				reqdata == undefined ||
				(reqdata[endpoitFileds[randomApi]] as string) == undefined;
		} catch (e) {
			isError = true;
		}

		if (DEV_MODE) console.log(`>> API > ${randomApi}${randomEndpoint} > ERROR: ${isError}`);

		if (isError) messageCreator(`Api: [${randomApi}${randomEndpoint}]() has failed!`, true);

		loopCounter++;
	} while (isError && loopCounter <= 5);

	if (isError) throw "Unable to fetch!";

	return {
		url: reqdata[endpoitFileds[randomApi]] as string,
		api: `Image by: ${parseApiUrl(randomApi)}`,
	};
};

export { getImage };
