import express from "express";
import morgan from "morgan";
import cors from "cors";
import { client } from "..";
import router from "./routes";

const PORT = parseInt(process.env.PORT ?? "8080");
const app = express();

app.set("trust proxy", 1);
app.use(morgan("common"));
app.use(cors());
app.use((req, _, next) => {
	req.client = client;
	req.auth =
		req.headers.authorization ??
		((req.query.auth as string) != "" && (req.query.auth as string) != undefined)
			? (req.query.auth as string)
			: null ?? null;
	next();
});

app.get("/", (_, res) => {
	res.json({
		success: true,
		data: {
			message: "Welcome to the Zero Two Bot Api!",
		},
	});
});

app.use(router);

export const startWeb = async (): Promise<void> => {
	app.listen(PORT, () => {
		console.log(`> Web listening on: ${PORT}`);
	});
};
