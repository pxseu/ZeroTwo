import { Router } from "express";
import { createHash } from "crypto";
import { epicHash } from "../config";

const router = Router();

router.get("/", (_, res) => {
	res.json({
		success: false,
		data: {
			message: "Please provide a id in the path!",
		},
	});
});

router.get("/:id", async (req, res) => {
	if (req.auth == undefined)
		return res.status(401).json({
			success: false,
			data: {
				message: "Not authorized!",
			},
		});

	const hash = createHash("sha512").update(req.auth, "utf8");

	if (hash.digest("hex") != epicHash)
		return res.status(401).json({
			success: false,
			data: {
				message: "Not authorized!",
			},
		});

	const uid = req.params.id;

	req.client.users
		.fetch(uid)
		.then((user) => {
			res.json({
				success: true,
				data: {
					user,
				},
			});
		})
		.catch(() => {
			res.json({
				success: true,
				data: {
					user: null,
				},
			});
		});
});

export default router;
