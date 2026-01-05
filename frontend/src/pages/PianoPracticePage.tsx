import { useParams } from "react-router-dom";
import GrandStaffPractice from "./GrandStaves/GrandStaffPractice";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserNote } from "./GrandStaves/GrandStaff";
import { getUserMappedKeys } from "../api/piano";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { pianoLiveListener } from "../util/pianoListenerSetup";
import { notes, enharmonicFlats, noteFrequencies } from "../util/notes88";
import parseNotes from "../util/parseNotes";
import GrandStaffRange from "./GrandStaves/GrandStaffRange";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode wheere you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time

  // TODO have a correct and incorrect counter along with like time elapsed for the current session

  // (for the ones above and bellow you probably want to make it just a <p> with 2 buttons that increment it up or down)

  // TODO: make it so users cant input their own values in the range inputs. Only being allowed to click or hold the given buttons

  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);
  const [randomKey, setRandomKey] = useState<UserNote>();
  const [start, setStart] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [includeSharps, setIncludeSharps] = useState<boolean>(true);
  const [includeFlats, setIncludeFlats] = useState<boolean>(true);
  const [highNoteIndex, setHighNoteIndex] = useState<number>(0);
  const highNote = parseNotes(notes[highNoteIndex]);
  const [lowNoteIndex, setLowNoteIndex] = useState<number>(0);
  const lowNote = parseNotes(notes[lowNoteIndex]);
  const stopListenerRef = useRef<(() => void) | null>(null);

  // Gives the practice program a random note within the set range to test the user on
  const randomNote = useCallback(
    (userKeys: UserNote[]) => {
      const randNum: number =
        Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
        lowNoteIndex;

      // since we are just making a copy you can update the baseNote, frequency, and accidental without having to worry about it messing up future things
      const randomKey = { ...userKeys[randNum] };
      console.log(randomKey);

      if (includeFlats && includeSharps && randomKey.noteType === "sharp") {
        const canBeFlat = /^[ACDFG]/.test(randomKey.baseNote);
        if (canBeFlat) {
          // %50 for it to swap from a sharp to a flat if both are active when practicing
          const result = Math.round(Math.random());

          // update the note to be a flat
          if (result == 1) {
            randomKey.noteType = "flat";
            const note = randomKey.baseNote[0] + "#" + randomKey.baseNote[2];
            const flatNote = enharmonicFlats[note];
            // Update it to a baseNote because we are adding the accidental within the grandStaff
            const baseNote = flatNote.replace("b", "/");
            randomKey.baseNote = baseNote; // updating because a sharp and flat of the same note aren't on the same line
          }
        }
        // 50/50 for what one it will pick
      } else if (includeFlats && randomKey.noteType === "sharp") {
        const canBeFlat = /^[ACDFG]/.test(randomKey.baseNote);
        if (canBeFlat) randomKey.noteType = "flat";
      }
      setRandomKey(randomKey);
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
    if (start && randomKey) {
      pianoLiveListener(randomKey.frequency, setCorrect).then((stop) => {
        stopListenerRef.current = stop; // Pointer to the function that will stop the listener
      });
    } else {
      stopListenerRef.current?.();
      stopListenerRef.current = null;
    }

    return () => stopListenerRef.current?.();
  }, [randomKey, start]);

  // After a 1 second delay change to a new randomNote and reset correct to null
  useEffect(() => {
    if (correct === true) {
      setTimeout(() => {
        randomNote(userKeys);
        setCorrect(null);
      }, 1000);
    }
  }, [correct, randomNote, userKeys, highNoteIndex, lowNoteIndex]);

  return (
    <>
      <button
        onClick={() => {
          randomNote(userKeys);
          setStart((prevStart) => !prevStart);
        }}
      >
        {!start ? "Start" : "Stop"}
      </button>
      {start && randomKey ? (
        <div>
          <GrandStaffPractice
            currentNoteValue={randomKey.baseNote}
            currentNoteAccidental={randomKey.noteType}
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
