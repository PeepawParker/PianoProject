import { useEffect, useState } from "react";
import { pianoListenerThreeSec } from "../../util/pianoListenerSetup";
import PianoRange from "../../util/PianoRange";
import { useParams } from "react-router-dom";
import { notes } from "../../util/notes88";
import type { UserNote } from "../../util/GrandStaves/GrandStaff";
import { postPutUserPianoKey } from "../../api/piano";

const Key88 = () => {
  const { pianoId } = useParams();
  const [listening, setListening] = useState<boolean>(false);
  const [readyToListen, setReadyToListen] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(19);
  const high: number = 87;
  const low: number = 0;
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);

  const handleClick = async () => {
    setListening(true);
    try {
      const avg: number = await pianoListenerThreeSec(current);
      console.log(avg, "average recieved");
      // TODO need to have a way for it to know whether it should be posting or updating the UserPianoKey
      const existingKey = userKeys?.find((key) => key.note_id - 1 === current);
      console.log(userKeys);
      console.log("Does it exist: ", existingKey);
      if (existingKey) {
        postPutUserPianoKey(pianoId!, avg, notes[current], "put", setUserKeys);
      } else {
        postPutUserPianoKey(pianoId!, avg, notes[current], "post", setUserKeys);
      }
    } finally {
      setCurrent((prevCurrent) => prevCurrent + 1);
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
        current={current}
        high={high}
        low={low}
        setCurrent={setCurrent}
        readyToListen={readyToListen}
        userKeys={userKeys}
        setUserKeys={setUserKeys}
      />

      {readyToListen ? (
        <div>
          <p>Currently Listening to {notes[current]} </p>
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
