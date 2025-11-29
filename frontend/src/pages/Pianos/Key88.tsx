import { useEffect, useState } from "react";
import { pianoListenerThreeSec } from "../../util/pianoListenerSetup";
import PianoRange from "../../util/PianoRange";
import { useParams } from "react-router-dom";
import { postUserPianoKey } from "../../api/Piano/postPiano";
import { notes } from "../../util/notes88";
import type { UserNote } from "../../util/GrandStaff";

const Key88 = () => {
  const { pianoId } = useParams();
  const [listening, setListening] = useState<boolean>(false);
  const [readyToListen, setReadyToListen] = useState<boolean>(false);
  const [low, setLow] = useState<number>(19);
  const [high, setHigh] = useState<number>(56);
  const [userKeys, setUserKeys] = useState<UserNote[] | undefined>(undefined);

  const handleClick = async () => {
    setListening(true);
    try {
      const avg: number = await pianoListenerThreeSec(low);
      console.log(avg, "average recieved");
      // TODO need to have a way for it to know whether it should be posting or updating the UserPianoKey
      const existingKey = userKeys?.find((key) => key.noteId === low);
      if (existingKey) {
        console.log("bum ass");
        // updateUserPianoKey(pianoId!, avg, notes[low]);
      } else {
        postUserPianoKey(pianoId!, avg, notes[low]);
      }
    } finally {
      setLow((prevLow) => prevLow + 1);
      setListening(false);
    }
  };

  useEffect(() => {
    console.log(userKeys);
  }, [userKeys]);

  // It is going to start with a default range of the most common treble clef notes, and thenf rom there you can adjust the high and the low using a slider that will move the notes up or down the staff to show the range of values you will be inputting

  return (
    <>
      <PianoRange
        values={notes}
        numKeys={88}
        low={low}
        high={high}
        setHigh={setHigh}
        setLow={setLow}
        readyToListen={readyToListen}
        userKeys={userKeys}
        setUserKeys={setUserKeys}
      />

      {readyToListen ? (
        <div>
          <p>Number of keys left to map {high - low} </p>{" "}
          <p>Currently Listening to {notes[low]} </p>
        </div>
      ) : null}
      <div>
        <button
          disabled={listening}
          onClick={
            readyToListen ? () => handleClick() : () => setReadyToListen(true)
          }
        >
          {readyToListen
            ? listening
              ? "Listening"
              : "Click To Listen"
            : "Submit"}
        </button>
        {readyToListen ? <button>Retry</button> : <></>}
      </div>
    </>
  );
};

export default Key88;
