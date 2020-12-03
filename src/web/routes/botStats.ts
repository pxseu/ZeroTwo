import { EDESTADDRREQ } from "constants";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
	res.json({
        success: true,
        data: {
            userCount: req.client.users.cache.size,
            serverCount: req.client.guilds.cache.size,
            ping: req.client.ws.ping,
            tag: req.client.user.tag,
            uptime: req.client.uptime
        }
    })
});

export default router;