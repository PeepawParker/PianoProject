import { useParams } from "react-router-dom";
import GrandStaffPractice from "./GrandStaves/GrandStaffPractice";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserNote } from "./GrandStaves/GrandStaff";
import { getUserMappedKeys } from "../api/piano";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { pianoLiveListener } from "../util/pianoListenerSetup";
import { notes, enharmonicFlats } from "../util/notes88";
import parseNotes from "../util/parseNotes";
import GrandStaffRange from "./GrandStaves/GrandStaffRange";
import initializeRandNotes from "../util/firstRandNote";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode where you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time

  // TODO have a correct and incorrect counter along with like time elapsed for the current session

  // TODO make it a toggle for the number of notes that are made on the screen for practice

  // TODO when you remove flats and sharps update the frequencies, right now they stay as the sharp frequencies

  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [numPracticeNotes, setNumPracticeNotes] = useState<number>(1);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);

  // TODO instead of having four of these have 1 that is and array of userNotes that will instead add/remove/update the notes that are being given
  const [randomNotes, setRandomNotes] = useState<UserNote[]>([]);
  const [noteIndex, setNoteIndex] = useState<number>(0);

  const [start, setStart] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [includeSharps, setIncludeSharps] = useState<boolean>(false);
  const [includeFlats, setIncludeFlats] = useState<boolean>(false);
  const [highNoteIndex, setHighNoteIndex] = useState<number>(0);
  const highNote = parseNotes(notes[highNoteIndex]);
  const [lowNoteIndex, setLowNoteIndex] = useState<number>(0);
  const lowNote = parseNotes(notes[lowNoteIndex]);
  const stopListenerRef = useRef<(() => void) | null>(null);
  const currentNoteRef = useRef<UserNote | undefined>(undefined);

  // Gives the practice program a random note within the set range to test the user on
  // Make this for after the user gets a correct and then the other will be used to initialize the randomNotesArray
  const randomNote = useCallback(
    // When you take out the random key you just need to include the index so then you can go down one if its a sharp and they didnt want to include sharps rather than retrieving it from the notes88 page
    (userKeys: UserNote[]) => {
      const randNum: number =
        Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
        lowNoteIndex;

      // since we are just making a copy you can update the baseNote, frequency, and accidental without having to worry about it messing up future things
      const randomNote = { ...userKeys[randNum] };

      if (includeFlats && includeSharps && randomNote.noteType === "sharp") {
        const canBeFlat = /^[ACDFG]/.test(randomNote.baseNote);
        if (canBeFlat) {
          // %50 for it to swap from a sharp to a flat if both are active when practicing
          const result = Math.round(Math.random());

          // update the note to be a flat
          if (result == 1) {
            randomNote.noteType = "flat";
            randomNote.baseNote = enharmonicFlats[randomNote.baseNote]; // updating because a sharp and flat of the same note aren't on the same line
          }
        }
      } else if (includeFlats && randomNote.noteType === "sharp") {
        const canBeFlat = /^[ACDFG]/.test(randomNote.baseNote);
        if (canBeFlat) randomNote.noteType = "flat";
      } else if (
        !includeSharps &&
        !includeFlats &&
        randomNote.noteType === "sharp" // Don't need to check for flats because they will always by default be sharp uless they are changed in this function
      ) {
        // update the sharp frequencies to standard frequencies
        randomNote.frequency = userKeys[randNum - 1].frequency;
        randomNote.noteType = "natural";
      }

      // Need to figure out how im going to update the ref dynamically
      // I think I can use the index to have it update to whatever the index is in a useEffect, or maybe it'd be one more than the index and then if the index is the numPracticeNotes then I would reset it back to randomNotes[0]

      // Need to update how I set the index because it will be updated dynamically
      // Dont check just set it to what the current index is
      // setRandomNote((prev) => prev[currentIndex]) when you do this also set the curRef
      return randomNote;
    },
    [highNoteIndex, includeFlats, includeSharps, lowNoteIndex]
  );

  // Sets the highNote Index after userKeys is defined
  useEffect(() => {
    if (userKeys.length > 0) {
      setHighNoteIndex(userKeys.length - 1);
    }
  }, [userKeys.length]);

  // If there is a valid userId and pianoId it will fetch this pianos Keys
  useEffect(() => {
    if (!userId || !pianoId) return;

    getUserMappedKeys(userId, pianoId, setUserKeys);
  }, [userId, pianoId]);

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

  // After a 1 second delay change to a new randomNote and reset correct to null
  useEffect(() => {
    if (correct === true) {
      setTimeout(() => {
        setRandomNotes((prevNotes) => {
          const copy = [...prevNotes];

          const note = randomNote(userKeys);
          copy[noteIndex] = note;
          currentNoteRef.current = copy[(noteIndex + 1) % numPracticeNotes];

          return copy;
        });

        setNoteIndex((i) => (i + 1 < numPracticeNotes ? i + 1 : 0));
        setCorrect(null);
      }, 250);
    }
  }, [
    correct,
    randomNote,
    userKeys,
    highNoteIndex,
    lowNoteIndex,
    noteIndex,
    numPracticeNotes,
  ]);

  return (
    <>
      <button
        onClick={() => {
          if (!start) {
            // Sets the first note seperately so that the ref is correctly initialized
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
          setStart((prevStart) => !prevStart);
        }}
      >
        {!start ? "Start" : "Stop"}
      </button>
      {start && randomNotes.length === numPracticeNotes ? (
        <div>
          <GrandStaffPractice
            randomNotes={randomNotes}
            noteIndex={noteIndex}
            correct={correct}
          />
        </div>
      ) : userKeys.length > 1 ? (
        <div>
          <GrandStaffRange
            highNoteValue={highNote.baseNote}
            highAccidental={highNote.noteType}
            lowNoteValue={lowNote.baseNote}
            lowAccidental={lowNote.noteType}
            includeSharps={includeSharps}
            includeFlats={includeFlats}
            userKeys={userKeys}
          />
          <label>
            <input
              type="checkbox"
              checked={includeSharps}
              onChange={(e) => setIncludeSharps(e.target.checked)}
            />
            Sharps Included In Practice
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeFlats}
              onChange={(e) => setIncludeFlats(e.target.checked)}
            />
            Flats Included In Practice
          </label>

          <p>Number of random notes you want to practice with</p>
          <input
            type="number"
            min={1}
            max={16}
            step={1}
            value={numPracticeNotes}
            onChange={(e) => setNumPracticeNotes(+e.target.value)}
          />

          <p>Highest Note allowed</p>
          <input
            type="number"
            min={lowNoteIndex + 1}
            max={userKeys.length - 1}
            step={1}
            value={highNoteIndex}
            onChange={(e) => setHighNoteIndex(+e.target.value)}
          />
          <p>Lowest Note allowed</p>
          <input
            type="number"
            min={0}
            max={highNoteIndex - 1}
            step={1}
            value={lowNoteIndex}
            onChange={(e) => setLowNoteIndex(+e.target.value)}
          />
        </div>
      ) : (
        <p>You have no notes to practice idk how but you dont bruh</p>
      )}
    </>
  );
}
