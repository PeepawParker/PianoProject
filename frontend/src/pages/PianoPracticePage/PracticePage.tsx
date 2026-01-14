import { useCallback, useEffect, useRef } from "react";
import GrandStaffPractice from "../GrandStaves/GrandStaffPractice";
import { randomNote } from "./PianoPracticeFunctions";
import { pianoLiveListener } from "../../util/pianoListenerSetup";
import { usePractice } from "../../contexts/PracticeContext";

export default function PracticePage() {
  const {
    start,
    userKeys,
    numPracticeNotes,
    trueRandom,
    includeSharps,
    includeFlats,
    highNoteIndex,
    lowNoteIndex,
    seconds,
    numCorrect,
    randomNotes,
    noteIndex,
    currentNoteRef,
    trebleStave,
    bassStave,
    setNoteIndex,
    setSeconds,
    setNumCorrect,
    setRandomNotes,
  } = usePractice();

  const firstIndexRef = useRef<number | undefined>(undefined);
  const stopListenerRef = useRef<(() => void) | null>(null);

  const handleCorrectNote = useCallback(() => {
    setRandomNotes((prev) => {
      const copy = [...prev];

      const note = randomNote(
        userKeys,
        trueRandom,
        includeSharps,
        includeFlats,
        noteIndex,
        lowNoteIndex,
        highNoteIndex,
        firstIndexRef
      );

      copy[noteIndex] = note;
      currentNoteRef.current = copy[(noteIndex + 1) % numPracticeNotes];

      return copy;
    });

    setNoteIndex((prev) => (prev + 1 < numPracticeNotes ? prev + 1 : 0));
    setNumCorrect((prev) => prev + 1);
  }, [
    setRandomNotes,
    setNoteIndex,
    setNumCorrect,
    userKeys,
    trueRandom,
    includeSharps,
    includeFlats,
    noteIndex,
    lowNoteIndex,
    highNoteIndex,
    currentNoteRef,
    numPracticeNotes,
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      if (start) {
        setSeconds((s) => s + 1);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [setSeconds, start]);

  // Starts the listener if user selects start and a randomKey is ready
  useEffect(() => {
    if (start && currentNoteRef.current) {
      pianoLiveListener(
        () => currentNoteRef.current!.frequency,
        handleCorrectNote
      ).then((stop) => {
        stopListenerRef.current = stop; // Pointer to the function that will stop the listener
      });
    } else {
      stopListenerRef.current?.();
      stopListenerRef.current = null;
    }

    return () => stopListenerRef.current?.();
  }, [currentNoteRef, handleCorrectNote, start]);

  return (
    <>
      {start && randomNotes.length === numPracticeNotes ? (
        <div>
          <p>Correct: {numCorrect}</p>
          <p>
            Time Elapsed: {Math.floor(seconds / 60)}:
            {seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60}
          </p>
          <GrandStaffPractice
            randomNotes={randomNotes}
            noteIndex={noteIndex}
            trebleStaveBool={trebleStave}
            bassStaveBool={bassStave}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
