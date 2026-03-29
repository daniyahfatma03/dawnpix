import { Router, type IRouter } from "express";
import healthRouter from "./health";
import themesRouter from "./themes";
import sessionsRouter from "./sessions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(themesRouter);
router.use(sessionsRouter);

export default router;
