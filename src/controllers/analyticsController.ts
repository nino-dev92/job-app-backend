import type { Request, Response } from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import mongoose from "mongoose";

export const getEmployerAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const employerId = new mongoose.Types.ObjectId(userId);

    // 1. Get all jobs by this employer
    const jobs = await Job.find({ createdBy: employerId });
    const jobIds = jobs.map((job) => job._id);

    // 2. Fundamental Stats
    const totalJobs = jobs.length;
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    
    // 3. Status Breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusCounts = {
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0
    };

    statusBreakdown.forEach((item) => {
      if (item._id in statusCounts) {
        (statusCounts as any)[item._id] = item.count;
      }
    });

    // 4. Monthly Trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedTrends = monthlyTrends.map(item => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        name: monthNames[item._id.month - 1],
        applications: item.count
      };
    });

    // 5. Calculate Hire Rate
    const hireRate = totalApplications > 0 
      ? Math.round((statusCounts.accepted / totalApplications) * 100) 
      : 0;

    res.json({
      summary: {
        totalJobs,
        totalApplications,
        hireRate,
        ...statusCounts
      },
      statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
      trends: formattedTrends
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
