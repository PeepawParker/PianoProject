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
import firstRandNote from "../util/firstRandNote";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode where you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time

  // TODO have a correct and incorrect counter along with like time elapsed for the current session

  // TODO make it a toggle for the number of notes that are made on the screen for practice

  // TODO when you remove flats and sharps update the frequencies, right now they stay as the sharp frequencies

  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);

  const [randomKeyOne, setRandomKeyOne] = useState<UserNote>();
  const [randomKeyTwo, setRandomKeyTwo] = useState<UserNote>();
  const [randomKeyThree, setRandomKeyThree] = useState<UserNote>();
  const [randomKeyFour, setRandomKeyFour] = useState<UserNote>();
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
  const randomNote = useCallback(
    // When you take out the random key you just need to include the index so then you can go down one if its a sharp and they didnt want to include sharps rather than retrieving it from the notes88 page
    (userKeys: UserNote[], curIndex: number) => {
      const randNum: number =
        Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
        lowNoteIndex;

      // since we are just making a copy you can update the baseNote, frequency, and accidental without having to worry about it messing up future things
      const randomKey = { ...userKeys[randNum] };
      console.log("randomKey before: ", randomKey);

      if (includeFlats && includeSharps && randomKey.noteType === "sharp") {
        const canBeFlat = /^[ACDFG]/.test(randomKey.baseNote);
        if (canBeFlat) {
          // %50 for it to swap from a sharp to a flat if both are active when practicing
          const result = Math.round(Math.random());

          // update the note to be a flat
          if (result == 1) {
            randomKey.noteType = "flat";
            randomKey.baseNote = enharmonicFlats[randomKey.baseNote]; // updating because a sharp and flat of the same note aren't on the same line
          }
        }
      } else if (includeFlats && randomKey.noteType === "sharp") {
        const canBeFlat = /^[ACDFG]/.test(randomKey.baseNote);
        if (canBeFlat) randomKey.noteType = "flat";
      } else if (
        !includeSharps &&
        !includeFlats &&
        randomKey.noteType === "sharp" // Don't need to check for flats because they will always by default be sharp uless they are changed in this function
      ) {
        // update the sharp frequencies to standard frequencies
        randomKey.frequency = userKeys[randNum - 1].frequency;
        randomKey.noteType = "natural";
      }

      console.log("here is what randomKey is: ", randomKey);

      if (curIndex === 0) {
        setRandomKeyOne(randomKey);
        currentNoteRef.current = randomKeyTwo;
        return 1;
      } else if (curIndex === 1) {
        setRandomKeyTwo(randomKey);
        currentNoteRef.current = randomKeyThree;
        return 2;
      } else if (curIndex === 2) {
        setRandomKeyThree(randomKey);
        currentNoteRef.current = randomKeyFour;
        return 3;
      } else {
        setRandomKeyFour(randomKey);
        currentNoteRef.current = randomKeyOne;
        return 0;
      }
    },
    [
      highNoteIndex,
      includeFlats,
      includeSharps,
      lowNoteIndex,
      randomKeyFour,
      randomKeyOne,
      randomKeyThree,
      randomKeyTwo,
    ]
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
        () => currentNoteRef.current?.frequency,
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
        const index = randomNote(userKeys, noteIndex);
        setNoteIndex(index);
        setCorrect(null);
      }, 1000);
    }
  }, [correct, randomNote, userKeys, highNoteIndex, lowNoteIndex, noteIndex]);

  return (
    <>
      <button
        onClick={() => {
          if (!start) {
            // Sets the first note seperately so that the ref is correctly initialized
            const firstNote = firstRandNote(
              includeFlats,
              includeSharps,
              highNoteIndex,
              lowNoteIndex,
              userKeys,
              setRandomKeyOne
            );

            let index = randomNote(userKeys, 1);
            index = randomNote(userKeys, index);
            randomNote(userKeys, index);

            currentNoteRef.current = firstNote;
            setNoteIndex(0);
          }
          setStart((prevStart) => !prevStart);
        }}
      >
        {!start ? "Start" : "Stop"}
      </button>
      {start &&
      randomKeyOne &&
      randomKeyTwo &&
      randomKeyThree &&
      randomKeyFour ? (
        <div>
          <GrandStaffPractice
            NoteOneValue={randomKeyOne.baseNote}
            NoteOneAccidental={randomKeyOne.noteType}
            NoteTwoValue={randomKeyTwo.baseNote}
            NoteTwoAccidental={randomKeyTwo.noteType}
            NoteThreeValue={randomKeyThree.baseNote}
            NoteThreeAccidental={randomKeyThree.noteType}
            NoteFourValue={randomKeyFour.baseNote}
            NoteFourAccidental={randomKeyFour.noteType}
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

          <p>Highest Note allowed</p>
          <input
            type="number"
            min={lowNoteIndex + 1}
            max={userKeys.length - 1}
            step={1}
            value={highNoteIndex}
            onChange={(e) => setHighNoteIndex(+e.target.value)}
          ></input>

          <p>Lowest Note allowed</p>
          <input
            type="number"
            min={0}
            max={highNoteIndex - 1}
            step={1}
            value={lowNoteIndex}
            onChange={(e) => setLowNoteIndex(+e.target.value)}
          ></input>
        </div>
      ) : (
        <p>You have no notes to practice idk how but you dont bruh</p>
      )}
    </>
  );
}
