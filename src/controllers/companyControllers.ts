import type { Request, Response } from "express";
import Company from "../models/Company.js";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, description, website, linkedin, instagram, glassdoor } =
      req.body;

    const userId = (req as any).user.id;

    const existingCompany = await Company.findOne({ name, user: userId });
    if (existingCompany) {
      return res.status(400).json({ message: "Company name already exists" });
    }

    await Company.create({
      name,
      description,
      website,
      linkedin,
      instagram,
      glassdoor,
      user: userId,
    });

    const company = await Company.findOne({ user: userId }).populate(
      "user",
      "name email",
    );

    res.status(201).json({ company });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const company = await Company.findOne({ user: userId }).populate(
      "user",
      "name email",
    );
    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }
    res.status(200).json({ company });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { name, description, website, linkedin, instagram, glassdoor } =
      req.body;
    const company = await Company.findOne({ user: userId });
    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }
    company.name = name || company.name;
    company.description = description || company.description;
    company.website = website || company.website;
    company.linkedin = linkedin || company.linkedin;
    company.instagram = instagram || company.instagram;
    company.glassdoor = glassdoor || company.glassdoor;
    await company.save();
    res.status(200).json({ company });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
