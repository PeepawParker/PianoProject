import { useEffect, useState } from "react";
import GrandStaff, { type UserNote } from "./GrandStaff";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { useParams } from "react-router-dom";
import { getUserMappedKeys } from "../api/piano";
import parseNotes from "./parseNotes";

export interface Note {
  baseNote: string;
  isSharp: boolean;
}

interface PianoRangeProps {
  values: string[];
  numKeys: number;
  high: number;
  setHigh: (num: number) => void;
  low: number;
  setLow: (num: number) => void;
  readyToListen: boolean;
  userKeys: UserNote[] | undefined;
  setUserKeys: (keys: UserNote[]) => void;
}

export default function PianoRange({
  values,
  numKeys,
  high,
  low,
  setHigh,
  setLow,
  readyToListen,
  userKeys,
  setUserKeys,
}: PianoRangeProps) {
  const { userId } = useSelector((state: AppRootState) => state.user);
  const { pianoId } = useParams();

  const [lowParsed, setLowParsed] = useState<Note>({
    baseNote: "E/2",
    isSharp: false,
  });
  const [highParsed, setHighParsed] = useState<Note>({
    baseNote: "F/5",
    isSharp: false,
  });

  const handleLowChange = (num: number) => {
    setLow(num);
    setLowParsed(parseNotes(values[num]));
  };

  const handleHighChange = (num: number) => {
    setHigh(num);
    setHighParsed(parseNotes(values[num]));
  };

  useEffect(() => {
    if (userId && pianoId)
      getUserMappedKeys(+userId, +pianoId, setUserKeys, parseNotes);
  }, [pianoId, setUserKeys, userId]);

  return (
    <>
      <GrandStaff
        highNoteValue={highParsed.baseNote}
        highIsSharp={highParsed?.isSharp}
        lowNoteValue={lowParsed.baseNote}
        lowIsSharp={lowParsed?.isSharp}
        userKeys={userKeys}
      />
      <p>
        {values[low]} to {values[high]}
      </p>
      {readyToListen ? null : (
        <div>
          <input
            type="number"
            min={0}
            max={numKeys - 1}
            step={1}
            value={low}
            onChange={(e) => handleLowChange(+e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={numKeys - 1}
            step={1}
            value={high}
            onChange={(e) => handleHighChange(+e.target.value)}
          />
        </div>
      )}
    </>
  );
}
