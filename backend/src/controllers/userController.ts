import { NextFunction, Request, Response } from "express";
import * as pianoModel from "../models/pianoModel";
import AppError from "../utils/appError";

export async function getUserPianos(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: number = parseInt(req.params.userId!, 10);

    const userPianos = await pianoModel.getPianosByUserId(userId);

    res.status(200).json({
      status: "success",
      userPianos,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserPianoKeys(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pianoId: number = parseInt(req.params.pianoId!, 10);

    const userPianoKeys = await pianoModel.getMappedKeysByPianoId(pianoId);

    if (userPianoKeys.length === 0) {
      return next(new AppError("No keys found for this piano", 404));
    }

    res.status(200).json({
      status: "success",
      userPianoKeys,
    });
  } catch (error) {
    next(error);
  }
}

export async function upsertUserData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      pianoId,
      seconds,
      numCorrect,
    }: { pianoId: string; numCorrect: number; seconds: number } = req.body;

    const exists = await pianoModel.pianoDataExists(pianoId);

    if (exists) {
      await pianoModel.updatePianoData(pianoId, seconds, numCorrect);
    } else {
      await pianoModel.postPianoData(pianoId, seconds, numCorrect);
    }

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
