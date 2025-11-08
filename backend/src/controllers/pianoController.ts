import { NextFunction, Request, Response } from "express";
import { Piano } from "../models/pianoModel";
import * as pianoModel from "../models/pianoModel";

export async function setup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const pianoName: string = req.body.pianoName;
  const numKeys: number = req.body.numKeys;
  const userId: number = req.body.userId;

  const piano: Piano = await pianoModel.postPiano(pianoName, numKeys, userId);

  res.status(200).json({
    status: "success",
    piano,
  });
}
