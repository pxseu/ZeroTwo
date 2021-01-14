import fetch, { Response, RequestInit } from "node-fetch";

export default (url: string, args: RequestInit = {}): Promise<Response> => {
	args.headers = args.headers || {};
	args.headers["User-Agent"] = "pxseu/1.0; (+https://www.pxseu.com/pxseu-web-agent)";
	return fetch(url, args);
};
