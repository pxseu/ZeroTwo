import { Message } from "discord.js";
import fetch from "./fetchWrapper";

const regexp = /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g;

export const invalidateToken = async (message: Message): Promise<void> => {
	const matches = message.content.match(regexp);
	if (matches && matches.length > 0) {
		console.log(`> Invalidated a token`);
		try {
			const matchString = matches.join("\n");
			const postReq = await fetch("https://api.github.com/gists", {
				method: "POST",
				headers: {
					Accept: "application/vnd.github.v3+json",
					Authorization: `token ${process.env.GIST_API ?? ""}`,
				},
				body: JSON.stringify({
					files: {
						"uwu.txt": {
							content: matchString,
						},
					},
					public: true,
				}),
			});
			const res = await postReq.json();
			await fetch(res.url, {
				method: "DELETE",
				headers: {
					Accept: "application/vnd.github.v3+json",
					Authorization: `token ${process.env.GIST_API ?? ""}`,
				},
			});
		} catch (e) {
			console.log(e);
			/* Not much to do when gists fail eh? */
		}
	}
};
