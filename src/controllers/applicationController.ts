import type { Request, Response } from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../utils/sendEmail.js";

//get all applications for specific employer
export const getAllApplications = async (req: Request, res: Response) => {
  const userId = (req as any)?.user?.id;

  try {
    const jobs = await Job.find({ createdBy: userId });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("user", "name email")
      .populate("job", "title description location");

    res.json({ applications });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get applications for specific job
export const getApplicationsForJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;

    const applications = await Application.find({ job: jobId! })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get application for specific user
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const applications = await Application.find({
      user: userId,
    })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update application Status for user by Employer
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("user", "email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔐 Ensure only job owner can update
    const job: any = application.job;

    if (job.createdBy.toString() !== (req as any).user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    application.status = status;
    await application.save();

    // 📧 Send email
    const user: any = application.user;

    await sendEmail({
      to: user.email,
      subject: "Application Update",
      text: `Hello ${user.name}, your application status is now: ${status}`,
    });

    res.json({
      message: "Status updated and email sent",
      application,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
