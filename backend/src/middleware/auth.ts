import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET as string
const authMiddleware = async (req : Request, res : Response, next : NextFunction) => {
  const token = req.headers.token as string;
  if (!token) {
    res.json({ succes: false, message: "Not Authorized, Login Again" });
    return
  }

  try {
    const token_decode = jwt.verify(token, JWT_SECRET);
    req.body.userId = (token_decode as jwt.JwtPayload).id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ succes: false, message: "Error" });
  }
};

export default authMiddleware;
