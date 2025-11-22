import { NextFunction, Request, Response } from "express";
import * as pianoModel from "../models/pianoModel";

export async function getUserPianos(
  req: Request,
  res: Response
): Promise<void> {
  const userId: number = parseInt(req.params.userId!, 10);

  const userPianos = await pianoModel.getPianosByUserId(userId);

  res.status(200).json({
    status: "success",
    userPianos,
  });
}
