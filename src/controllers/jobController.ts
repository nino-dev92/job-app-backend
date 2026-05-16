import type { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

// Employer Only
export const createJob = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne({ user: (req as any).user.id });

    if (!company) {
      return res
        .status(400)
        .json({ message: "You need to create a company profile first" });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id,
      createdBy: (req as any).user.id,
    });

    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    const { search, location } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("createdBy", "name")
      .populate("company", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate("company", "name");

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    res.json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    // Only owner can update
    if (job.createdBy.toString() !== (req as any).user.id) {
      return res.sendStatus(403);
    }

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    if (job.createdBy.toString() !== (req as any).user.id) {
      return res.sendStatus(403);
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Apply to job

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const userId = (req as any).user?.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const file = req.file as any;

    if (!file) {
      return res.status(400).json({ message: "CV is required" });
    }

    // ✅ Check if already applied
    const existingApplication = await Application.findOne({
      user: userId!,
      job: jobId!,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied" });
    }

    // ✅ Create new application
    const application = await Application.create({
      user: new mongoose.Types.ObjectId(userId),
      job: new mongoose.Types.ObjectId(jobId as string),
      cvUrl: file.path,
    });

    res.status(201).json({
      message: "Application submitted",
      application,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
