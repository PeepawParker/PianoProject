import { useEffect } from "react";
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
  low: number;
  current: number;
  setCurrent: (num: number) => void;
  readyToListen: boolean;
  userKeys: UserNote[] | undefined;
  setUserKeys: (keys: UserNote[]) => void;
}

export default function PianoRange({
  values,
  numKeys,
  high,
  low,
  current,
  setCurrent,
  readyToListen,
  userKeys,
  setUserKeys,
}: PianoRangeProps) {
  const { userId } = useSelector((state: AppRootState) => state.user);
  const { pianoId } = useParams();

  const currentParsed = parseNotes(values[current]);
  const highParsed = parseNotes(values[high]);
  const lowParsed = parseNotes(values[low]);

  useEffect(() => {
    if (userId && pianoId) getUserMappedKeys(userId, pianoId, setUserKeys);
  }, [pianoId, setUserKeys, userId]);

  return (
    <>
      <div>
        <GrandStaff
          highNoteValue={highParsed.baseNote}
          highIsSharp={highParsed?.isSharp}
          lowNoteValue={lowParsed.baseNote}
          lowIsSharp={lowParsed?.isSharp}
          currentNoteValue={currentParsed.baseNote}
          currentNoteIsSharp={currentParsed?.isSharp}
          userKeys={userKeys}
        />
      </div>
      <p>
        {values[current]} to {values[high]}
      </p>
      {readyToListen ? null : (
        <div>
          <p>Current Note Index</p>
          <input
            type="number"
            min={0}
            max={numKeys - 1}
            step={1}
            value={current}
            onChange={(e) => setCurrent(+e.target.value)}
          />
        </div>
      )}
    </>
  );
}
