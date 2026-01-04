import { useParams } from "react-router-dom";
import GrandStaffPractice from "../util/GrandStaves/GrandStaffPractice";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserNote } from "../util/GrandStaves/GrandStaff";
import { getUserMappedKeys } from "../api/piano";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { pianoLiveListener } from "../util/pianoListenerSetup";
import { notes } from "../util/notes88";
import parseNotes from "../util/parseNotes";
import GrandStaffRange from "../util/GrandStaves/GrandStaffRange";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode wheere you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time

  // TODO have a correct and incorrect counter along with like time elapsed for the current session
  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);

  const [userKeys, setUserKeys] = useState<UserNote[]>([]);
  const [randomKey, setRandomKey] = useState<UserNote>();

  const [start, setStart] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const [includeSharps, setIncludeSharps] = useState<boolean>(true);
  const [highNoteIndex, setHighNoteIndex] = useState<number>(0);
  const highNote = parseNotes(notes[highNoteIndex]);
  const [lowNoteIndex, setLowNoteIndex] = useState<number>(0);
  const lowNote = parseNotes(notes[lowNoteIndex]);

  const stopListenerRef = useRef<(() => void) | null>(null);

  const randomNote = useCallback(
    (userKeys: UserNote[]) => {
      const randNum: number =
        Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
        lowNoteIndex;

      const randomKey = userKeys[randNum];
      console.log("here is the randomKey: ", randomKey);
      if (!includeSharps) {
        randomKey.isSharp = false;
      }
      setRandomKey(randomKey);
    },
    [highNoteIndex, includeSharps, lowNoteIndex]
  );

  useEffect(() => {
    if (userKeys.length > 0) {
      setHighNoteIndex(userKeys.length - 1);
    }
  }, [userKeys.length]);

  // After doing this I just want you to make some quality of life changes so that the website runs atleast kinda decent and you don't need to remember the website in order to navigate it

  useEffect(() => {
    if (!userId || !pianoId) return;

    getUserMappedKeys(userId, pianoId, setUserKeys);
  }, [userId, pianoId]);

  useEffect(() => {
    if (start && randomKey) {
      // make randomKey include the frequency or just an array of the frequencies
      pianoLiveListener(randomKey.frequency, setCorrect).then((stop) => {
        stopListenerRef.current = stop; // After the listener is setup both functions return recursively calling the detect function until you call the stop function
      });
    } else {
      stopListenerRef.current?.();
      stopListenerRef.current = null;
    }

    return () => stopListenerRef.current?.();
  }, [randomKey, start]);

  useEffect(() => {
    // When the correct value is changed to true I want it to wait 1 second, and then get a new random key along with reseting the correct value to null
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
            currentNoteIsSharp={randomKey.isSharp}
            correct={correct}
          />
        </div>
      ) : userKeys.length > 1 ? (
        // Get a counter from 0 to length - 1 of the userNotes start the notes on 0 and 87 and then let them adjust these nubers for it to select the range of the notes that they will use for the practice
        <div>
          <GrandStaffRange
            highNoteValue={highNote.baseNote}
            highIsSharp={highNote.isSharp}
            lowNoteValue={lowNote.baseNote}
            lowIsSharp={lowNote.isSharp}
            userKeys={userKeys}
          />
          {/* TODO: make it so users can input their own values only allow them to interact with this through the arrow buttons */}
          <label>
            <input
              type="checkbox"
              checked={includeSharps}
              onChange={(e) => setIncludeSharps(e.target.checked)}
            />
            Sharps Included In Practice{" "}
            {/* Make this update the userKeys so that it doesn't show the sharps anymore */}
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

          {/* TODO: make it so users can input their own values only allow them to interact with this through the arrow buttons */}
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
