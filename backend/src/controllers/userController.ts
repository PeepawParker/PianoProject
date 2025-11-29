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

export async function getUserPianoKeys(
  req: Request,
  res: Response
): Promise<void> {
  const pianoId: number = parseInt(req.params.pianoId!, 10);

  const userPianoKeys = await pianoModel.getMappedKeysByPianoId(pianoId);

  res.status(200).json({
    status: "success",
    userPianoKeys,
  });
}
