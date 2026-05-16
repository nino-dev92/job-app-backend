import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import requireRole from "../middleware/requireRole.js";
import {
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
  getAllApplications,
} from "../controllers/applicationController.js";

const router = express.Router();

// Employer see total job applicants
router.get(
  "/applicants",
  verifyJWT,
  requireRole("employer"),
  getAllApplications,
);

// Employer → see specific job applicants
router.get(
  "/job/:id",
  verifyJWT,
  requireRole("employer"),
  getApplicationsForJob,
);

// Jobseeker → see their applications
router.get("/me", verifyJWT, requireRole("jobseeker"), getMyApplications);

router.patch(
  "/:id/status",
  verifyJWT,
  requireRole("employer"),
  updateApplicationStatus,
);

export default router;
