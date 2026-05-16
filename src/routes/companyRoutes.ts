import express from "express";
import {
  createCompany,
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyControllers.js";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";
const router = express.Router();

router.post("/create", verifyJWT, requireRole("employer"), createCompany);
router.put("/update", verifyJWT, requireRole("employer"), updateCompanyProfile);
router.get("/profile", verifyJWT, requireRole("employer"), getCompanyProfile);

export default router;
