import { Router } from "express";

import { getTrending } from "./trending.controller";

const router = Router();

router.get("/", getTrending);

export default router;
