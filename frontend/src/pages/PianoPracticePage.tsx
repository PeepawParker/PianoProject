import { Link, useParams } from "react-router-dom";
import GrandStaffPractice from "../util/GrandStaffPractice";
import { useEffect, useState } from "react";
import type { UserNote } from "../util/GrandStaff";
import { getUserMappedKeys } from "../api/piano";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import parseNotes from "../util/parseNotes";

export default function PianoPracticePage() {
  // Todo add a like left / right hand mode wheere you practice 2 hands at once with it displaying notes in the treble and bass cleff 2 notes at the same time
  const { pianoId } = useParams();
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);
  const [randomKey, setRandomKey] = useState<UserNote>();
  const [start, setStart] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  // TODO make the user select the range of notes they would like to practice along with sharps or no sharps before allowing them to start the practice

  useEffect(() => {
    if (!userId || !pianoId) return;

    getUserMappedKeys(userId, pianoId, setUserKeys);
  }, [userId, pianoId]);

  function randomNote() {
    const max = userKeys.length;
    const randNum: number = Math.floor(Math.random() * max - 1);
    const randomKey = userKeys[randNum];
    setRandomKey(randomKey);
  }

  return (
    <>
      <button
        onClick={() => {
          randomNote();
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
