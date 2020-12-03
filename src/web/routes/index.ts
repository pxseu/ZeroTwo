import { Router } from "express";
import botStats from "./botStats";
import fetchUser from "./fetchUser";

const router = Router();

router.use("/fetchUser", fetchUser);

router.use("/botStats", botStats);

router.use((_, res) => {
	res.status(404).json({
		success: false,
		data: {
			message: "Endpoint not found",
		},
	});
});

export default router;
