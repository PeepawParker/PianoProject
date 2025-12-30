import { useParams } from "react-router-dom";
import GrandStaffPractice from "../util/GrandStaves/GrandStaffPractice";
import { useEffect, useRef, useState } from "react";
import type { UserNote } from "../util/GrandStaves/GrandStaff";
import { getUserMappedKeys } from "../api/piano";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { pianoLiveListener } from "../util/pianoListenerSetup";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode wheere you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time

  // TODO have a correct and incorrect counter along with like time elapsed for the current session
  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);
  const [randomKey, setRandomKey] = useState<UserNote>();
  const [start, setStart] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const stopListenerRef = useRef<(() => void) | null>(null);

  function randomNote(userKeys: UserNote[]) {
    const max = userKeys.length;
    const randNum: number = Math.floor(Math.random() * max);
    const randomKey = userKeys[randNum];
    console.log("here is the randomKey: ", randomKey, userKeys);
    setRandomKey(randomKey);
  }

  // TODO make the user select the range of notes they would like to practice along with sharps or no sharps before allowing them to start the practice
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
      });
    }
  }, [correct, userKeys]);

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
          {/* TODO when measuring the frequency make sure there is some wiggle room that is proportionate to the note frequency, make it a percentage of the notes expected frequency */}
          <GrandStaffPractice
            currentNoteValue={randomKey.baseNote}
            currentNoteIsSharp={randomKey.isSharp}
            correct={correct}
          />
        </div>
      ) : (
        <div>
          {/* This is going to be where the user selects the range of notes they want to practice */}
          {/* <GrandStaffRange /> */}
        </div>
      )}
    </>
  );
}
