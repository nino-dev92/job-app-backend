import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";
import { getEmployerAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/", verifyJWT, requireRole("employer"), getEmployerAnalytics);

export default router;
