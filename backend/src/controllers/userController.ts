import { NextFunction, Request, Response } from "express";

export function login(req: Request, res: Response, next: NextFunction) {
  console.log("it is working");
  res.status(200).json({
    status: "success",
  });
}
