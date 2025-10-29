import { NextFunction, Request, Response } from "express";
import * as userModel from "../models/userModels";
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response, next: NextFunction) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const email: string = req.body.email;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userModel.postNewUser(username, hashedPassword, email);
  res.status(201).json({
    status: "success",
  });
}
