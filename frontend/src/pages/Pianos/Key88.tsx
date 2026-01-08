import { useState } from "react";
import { pianoListenerThreeSec } from "../../util/pianoListenerSetup";
import PianoRange from "../PianoRange";
import { useParams } from "react-router-dom";
import { notes } from "../../util/notes88";
import type { UserNote } from "../GrandStaves/GrandStaff";
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
      if (avg != 0) {
        const existingKey = userKeys?.find(
          (key) => key.note_id - 1 === current
        );
        if (existingKey) {
          postPutUserPianoKey(
            pianoId!,
            avg,
            notes[current],
            "put",
            setUserKeys
          );
        } else {
          postPutUserPianoKey(
            pianoId!,
            avg,
            notes[current],
            "post",
            setUserKeys
          );
        }
        setCurrent((i) => (i + 1 < high ? i + 1 : 0));
      }
    } finally {
      setListening(false);
    }
  };

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
        {readyToListen ? (
          <>
            <button
              disabled={listening}
              onClick={() => setCurrent((i) => (i + 1 < high ? i + 1 : low))}
            >
              ↑
            </button>
            <button
              disabled={listening}
              onClick={() => setCurrent((i) => (i - 1 >= low ? i - 1 : high))}
            >
              ↓
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Key88;
