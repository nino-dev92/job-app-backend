import express from "express";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";
import {
  createJob,
  applyToJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import upload from "../middleware/upload.js";

router.get("/", getJobs);
router.get("/:id", getJobById);

router.post("/create", verifyJWT, requireRole("employer"), createJob);
router.put("/update/:id", verifyJWT, requireRole("employer"), updateJob);
router.delete("/delete/:id", verifyJWT, requireRole("employer"), deleteJob);

router.post(
  "/apply/:id",
  verifyJWT,
  requireRole("jobseeker"),
  upload.single("cv"),
  applyToJob,
);

export default router;
