import { useState } from "react";
import GrandStaff from "./GrandStaff";

function parseNotes(note: string) {
  note = note.slice(0, 1) + "/" + note.slice(1);
  if (note.includes("#")) {
    return { baseNote: note.replace("#", ""), isSharp: true };
  } else {
    return { baseNote: note.replace("#", ""), isSharp: true };
  }
}

interface Note {
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
}

export default function PianoRange({
  values,
  numKeys,
  high,
  low,
  setHigh,
  setLow,
  readyToListen,
}: PianoRangeProps) {
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

  return (
    <>
      <GrandStaff
        highNoteValue={highParsed.baseNote}
        highIsSharp={highParsed?.isSharp}
        lowNoteValue={lowParsed.baseNote}
        lowIsSharp={lowParsed?.isSharp}
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
