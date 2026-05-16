import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
dotenv.config({ debug: true });

interface JwtPayload {
  id: string;
  role: "employer" | "jobseeker";
}

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader: any = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token: string = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);

    (req as any).user = user;
    next();
  });
};

export default verifyJWT;
