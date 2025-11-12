import { NextFunction, Request, Response } from "express";
import * as userModel from "../models/userModels";
import bcrypt from "bcrypt";
import AppError from "../utils/appError";
import { User } from "../models/userModels";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const email: string = req.body.email;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user: User = await userModel.postNewUser(
    username,
    hashedPassword,
    email
  );
  res.status(201).json({
    status: "success",
    user,
  });
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const username: string = req.body.username;
  const password: string = req.body.password;
  let user: User;

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    user = await userModel.getUserByEmail(username);
  } else {
    user = await userModel.getUserByUsername(username);
  }

  if (!user) {
    return next(new AppError("Incorrect Username/Password", 400));
  }

  const correctPassword: boolean = await bcrypt.compare(
    password,
    user.password
  );

  if (!correctPassword) {
    return next(new AppError("Incorrect Username/Password", 400));
  }
  res.status(200).json({
    status: "success",
    user,
  });
}
