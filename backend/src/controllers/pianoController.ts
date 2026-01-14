import { NextFunction, Request, Response } from "express";
import { Piano } from "../models/pianoModel";
import * as pianoModel from "../models/pianoModel";
import AppError from "../utils/appError";

export async function setup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pianoName: string = req.body.pianoName;
    const numKeys: number = req.body.numKeys;
    const userId: number = req.body.userId;

    const piano = await pianoModel.postPiano(pianoName, numKeys, userId);

    if (!piano) {
      return next(
        new AppError(
          "There was an error making this new piano please try again",
          500
        )
      );
    }

    await pianoModel.postDefaultKeys(piano.id);

    res.status(200).json({
      status: "success",
      piano,
    });
  } catch (error) {
    return next(
      new AppError(
        "There was an error setting up the pianokeys. Please try again",
        500
      )
    );
  }
}

export async function postKeyFrequency(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log("we in post");
  try {
    const {
      pianoId,
      frequency,
      currentNote,
    }: {
      pianoId: string;
      frequency: number;
      currentNote: string;
    } = req.body;

    const note = await pianoModel.getNoteFromString(currentNote);
    if (!note) {
      return next(new AppError("This note could not be found", 404));
    }
    const pianoKey = await pianoModel.postPianoKey(+pianoId, frequency, note);
    res.status(200).json({
      status: "success",
      pianoKey,
    });
  } catch (error) {
    next(error);
  }
}

export async function putKeyFrequency(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log("we in here");
    const {
      pianoId,
      frequency,
      currentNote,
    }: {
      pianoId: string;
      frequency: number;
      currentNote: string;
    } = req.body;

    const note = await pianoModel.getNoteFromString(currentNote);
    if (!note) {
      return next(new AppError("This note could not be found", 404));
    }

    await pianoModel.putPianoKey(+pianoId, frequency, note);
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
}
