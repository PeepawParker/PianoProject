import { useEffect, useRef, useState } from "react";
import GrandStaffPractice from "../GrandStaves/GrandStaffPractice";
import type { UserNote } from "../GrandStaves/GrandStaff";
import { randomNote } from "./PianoPracticeFunctions";
import { pianoLiveListener } from "../../util/pianoListenerSetup";
import initializeRandNotes from "../../util/firstRandNote";
import { useParams } from "react-router-dom";
import { uploadUserData } from "../../api/Users/uploadUserData";
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
  } = usePractice();

  const [randomNotes, setRandomNotes] = useState<UserNote[]>([]);
  const [noteIndex, setNoteIndex] = useState<number>(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const stopListenerRef = useRef<(() => void) | null>(null);
  const currentNoteRef = useRef<UserNote | undefined>(undefined);

  const { pianoId } = useParams();

  // After a 1 second delay change to a new randomNote and reset correct to null
  useEffect(() => {
    if (correct === true) {
      setTimeout(() => {
        setRandomNotes((prevNotes) => {
          const copy = [...prevNotes];

          const note = randomNote(
            userKeys,
            trueRandom,
            includeSharps,
            includeFlats,
            noteIndex,
            lowNoteIndex,
            highNoteIndex
          );
          copy[noteIndex] = note;
          currentNoteRef.current = copy[(noteIndex + 1) % numPracticeNotes];

          return copy;
        });

        setNoteIndex((i) => (i + 1 < numPracticeNotes ? i + 1 : 0));
        setNumCorrect((prev) => prev + 1);
        setCorrect(null);
      }, 250);
    }
  }, [
    correct,
    highNoteIndex,
    includeFlats,
    includeSharps,
    lowNoteIndex,
    noteIndex,
    numPracticeNotes,
    trueRandom,
    userKeys,
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      if (start) {
        setSeconds((s) => s + 1);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [start]);

  // Starts the listener if user selects start and a randomKey is ready
  useEffect(() => {
    if (start && currentNoteRef.current) {
      pianoLiveListener(
        () => currentNoteRef.current!.frequency,
        setCorrect
      ).then((stop) => {
        stopListenerRef.current = stop; // Pointer to the function that will stop the listener
      });
    } else {
      stopListenerRef.current?.();
      stopListenerRef.current = null;
    }

    return () => stopListenerRef.current?.();
  }, [start]);

  useEffect(() => {
    if (start && randomNotes.length == 0) {
      const firstNote = initializeRandNotes(
        numPracticeNotes,
        includeFlats,
        includeSharps,
        highNoteIndex,
        lowNoteIndex,
        userKeys,
        setRandomNotes
      );
      currentNoteRef.current = firstNote;
      setNoteIndex(0);
    }
  }, [
    highNoteIndex,
    includeFlats,
    includeSharps,
    lowNoteIndex,
    numPracticeNotes,
    randomNotes.length,
    start,
    userKeys,
  ]);

  useEffect(() => {
    if (!start && seconds > 0 && numCorrect > 0 && pianoId) {
      uploadUserData(numCorrect, seconds, pianoId);
    }
  }, [numCorrect, pianoId, seconds, start]);

  return (
    <>
      {start && randomNotes.length === numPracticeNotes ? (
        <div>
          <p>Correct: {numCorrect}</p>
          <p>
            Time Eslapsed: {Math.floor(seconds / 60)}:
            {seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60}
          </p>
          <GrandStaffPractice
            randomNotes={randomNotes}
            noteIndex={noteIndex}
            correct={correct}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
