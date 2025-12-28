import { Link, useParams } from "react-router-dom";
import GrandStaffPractice from "../util/GrandStaffPractice";
import { useEffect, useState } from "react";
import type { UserNote } from "../util/GrandStaff";
import { getUserMappedKeys } from "../api/piano";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import parseNotes from "../util/parseNotes";
import { pianoLiveListener } from "../util/pianoListenerSetup";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode wheere you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time
  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);
  const [randomKey, setRandomKey] = useState<UserNote>();
  const [start, setStart] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  function randomNote(userKeys: UserNote[]) {
    const max = userKeys.length;
    const randNum: number = Math.floor(Math.random() * max);
    const randomKey = userKeys[randNum];
    console.log("here is the randomKey: ", randomKey, userKeys);
    setRandomKey(randomKey);
  }

  // TODO make the user select the range of notes they would like to practice along with sharps or no sharps before allowing them to start the practice

  useEffect(() => {
    if (!userId || !pianoId) return;

    getUserMappedKeys(userId, pianoId, setUserKeys);
  }, [userId, pianoId]);

  useEffect(() => {
    if (start && randomKey) {
      pianoLiveListener();
    }
    // Make sure that the listener stops running when these requirements aren't met
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
        <></>
      )}
    </>
  );
}
