import { NextFunction, Request, Response } from "express";
import { Piano } from "../models/pianoModel";
import * as pianoModel from "../models/pianoModel";

export async function setup(req: Request, res: Response): Promise<void> {
  const pianoName: string = req.body.pianoName;
  const numKeys: number = req.body.numKeys;
  const userId: number = req.body.userId;

  const piano: Piano = await pianoModel.postPiano(pianoName, numKeys, userId);

  res.status(200).json({
    status: "success",
    piano,
  });
}

export async function postKeyFrequency(
  req: Request,
  res: Response
): Promise<void> {
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
  if (note) {
    const pianoKey = await pianoModel.postPianoKey(+pianoId, frequency, note);
    res.status(200).json({
      status: "success",
      pianoKey,
    });
  } else {
    // TODO send error
  }
}

export async function putKeyFrequency(
  req: Request,
  res: Response
): Promise<void> {
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

  if (note) {
    await pianoModel.putPianoKey(+pianoId, frequency, note);
  } else {
    // TODO send error
  }

  const userPianoKeys = await pianoModel.getMappedKeysByPianoId(+pianoId);

  res.status(200).json({
    status: "success",
    userPianoKeys,
  });
}
