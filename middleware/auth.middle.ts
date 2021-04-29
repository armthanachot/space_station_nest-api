import { NextFunction, Request, Response } from "express";
import { SECRET_KEY } from "../constants/config";
import * as jwt from "jsonwebtoken";

const verifyToken = async (roles: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization.split(" ");
      if (!token) {
        return res.status(401).json({ message: "INVALID TOKEN" });
      }
      const decrypted = await jwt.verify(token[1], SECRET_KEY);
      console.log(decrypted);
      const {role} = decrypted.data
      if(!roles.includes(role)){
          return res.status(401).json({message:"PERMISSION DENIED"})
      }
      return next();
    } catch (error) {
      console.log(error.message);
      return res.status(401).json({ message: error.message });
    }
  };
};

export { verifyToken };
