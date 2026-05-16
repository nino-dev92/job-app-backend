import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ debug: true });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await User.findOne({ name, email });
    if (exists) {
      res.status(400).json({ message: "User already Exists" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
    });
    res.status(201).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user?._id, role: user?.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user?._id, role: user?.role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" },
    );

    res.cookie("jwt", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: false,
      httpOnly: true,
    });

    await User.findOneAndUpdate({ email }, { $set: { refreshToken } });
    res
      .status(200)
      .json({ accessToken, name: user?.name, role: user?.role, id: user?.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.jwt;
  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      (req as any).user = user;
      res.status(200).json({ accessToken });
    },
  );
};
